export {};

type predicate<T> = (T) => boolean;

interface KeyArrayPair<K, T> {
    key: K;
    array: Array<T>;
}

declare global {
    interface Array<T> {
        single(): T;
        first(lambda?: predicate<T>): T;
        indexOfFirst(lambda: predicate<T>): number;
        any(lambda?: predicate<T>): boolean;
        select<R>(lambda?: (item: T) => R): Array<R>;
        where(lambda: predicate<T>): Array<T>;
        distinct(lambda?: (a: T, b: T) => boolean): Array<T>;
        count(lambda?: predicate<T>): number;
        remove(item: T);
        /**
         * Aggregates the elements of the array into the aggregate object via the aggregate lambda operator
         * s.t. aggregate(agg, lambda) = lambda( lambda( ... lamba(agg, R_0) , R_(n-2) ), R_(n-1) )
         * @param aggregate The initial/empty value to be aggregated into
         * @param lambda The function which returns the result of aggregating an individual element into a
         *  running aggregate object
         * @returns The final result of calling the aggregate lambda on every element in the array.
         */
        aggregate<R>(lambda: (agg: R, elem: T) => R, aggregate?: R): R;
        /**
         * Sums the values of the array as mapped by the lambda. If no lambda is provided, this sums the elements
         * of the array.
         * @param lambda To map the element to what should be summed
         * @returns The sum of lambda(element) over each element in the array
         */
        sum<R>(lambda?: (elem: T) => R): R;
        /**
         * Groups the elements of the array into KeyArrayPairs with each element's key provided by lambda(elem).
         * @param lambda Method that generates the group key from an element in the array
         * @returns An array of KeyArrayPair values with keys corresponding to the results of the provided lambda
         * and arrays of elements that map to respective keys
         */
        groupBy<R>(lambda: (elem: T) => R): Array<KeyArrayPair<R, T>>;
    }
}

Array.prototype.remove = function (item) {
    const ndx = this.indexOf(item);
    if (ndx >= 0) {
        this.splice(ndx, 1);
    }
}

Array.prototype.single = function () {
    if (this.length === 1) {
        return this[0];
    } else {
        if (this.length === 0) {
            throw 'Collection has no items.';
        } else {
            throw 'Collection has more than one item.';
        }
    }
}

Array.prototype.first = function (lambda?: predicate<any>) {
    if (!lambda && this.length > 0) {
        return this[0];
    }
    for (var x of this) {
        if (lambda(x)) {
            return x;
        }
    }
    return null;
}

Array.prototype.indexOfFirst = function (lambda?: predicate<any>) {
    var result = -1;
    var n = 0;
    while (result < 0 && n < this.length) {
        if (lambda(this[n])) {
            result = n;
        }
        n++;
    }
    return result;
}

Array.prototype.any = function (lambda?: predicate<any>) {
    return this.first(lambda) != null;
}

Array.prototype.select = function (lambda?: (item: any) => any): Array<any> {
    var result = [];
    for (var i of this) {
        result.push(lambda(i));
    }
    return result;
}

Array.prototype.where = function (lambda: predicate<any>): Array<any> {
    var result = [];
    for (var i of this) {
        if (lambda(i)) {
            result.push(i);
        }
    }
    return result;
}

Array.prototype.distinct = function (lambda?: (a: any, b: any) => boolean) {
    var result = [];
    var predicate: predicate<any>;

    if (lambda) {
        predicate = i => !result.any(x => lambda(i, x));
    } else {
        predicate = i => result.indexOf(i) < 0;
    }

    for (var i of this) {
        if (predicate(i)) {
            result.push(i);
        }
    }

    return result;
}

Array.prototype.count = function (lambda?: predicate<any>): number {
    if (!lambda) return this.length;
    return this.where(lambda).length;
}

Array.prototype.aggregate = function <R>(lambda: (agg: R, elem: any) => R, aggregate: R = null) {
    for (var i of this) {
        aggregate = lambda(aggregate, i);
    }
    return aggregate;
}

Array.prototype.sum = function <R>(lambda?: (elem: any) => R): R {
    if (!lambda) lambda = elem => elem;

    var sum: R = null;
    for (var i of this) {
        if (sum == null) {
            sum = lambda(i);
        } else {
            sum = (<any>sum) + lambda(i);
        }
    }

    return sum;
}

Array.prototype.groupBy = function <K>(lambda: (t: any) => K): Array<KeyArrayPair<any, K>> {
    var result = new Array<KeyArrayPair<K, any>>();

    for (var elem of this) {
        var key = lambda(elem);

        //Get the KeyArrayPair corresponding to the current key
        var pair = result.where(pair => pair.key == key)
            .first();

        if (!pair) {
            //If the KeyArrayPair doesn't exist, create one and add it
            var newPair: KeyArrayPair<K, any> = {
                key: key,
                array: [elem]
            }
            result.push(newPair);
        } else {
            //Otherwise, add the element to the existing KeyArrayPair's array
            pair.array.push(elem);
        }
    }
    return result;
}

//Define groupBy in a closure to hide internal methods groupBy and groupByHash. By not declaring
//the methods in the prototype we can avoid re-instantiating the sub-methods on every call
;(() => {
    Array.prototype.groupBy = function <K>(lambda: (t: any) => K): Array<KeyArrayPair<any, K>> {
        // It's an imperfect check, but if the lambda of the first element returns a string or number,
        // then the key type is hashable and the hash algorithm will be used to speed up performance.
        // Note, that there is probably a way to convert non-hashable keys (simple example would be JSON.stringify)
        // but this could cause unintended consequences (i.e. since {id: 0} != {id: 0}, hashing would be hard)
        if (this.any()) {
            var firstKeyType = typeof (lambda(this.first()));
            if (firstKeyType == "string" || firstKeyType == "number") {
                return groupByHash(this, <any>lambda);
            }
        }
        return groupBy(this, lambda);
    }

    function groupBy<K>(array: Array<any>, lambda: (t: any) => K): Array<KeyArrayPair<any, K>> {
        var result = new Array<KeyArrayPair<K, any>>();

        for (var elem of array) {
            var key = lambda(elem);

            //Get the KeyArrayPair corresponding to the current key
            var pair = result.where(pair => pair.key == key)
                .first();

            if (!pair) {
                //If the KeyArrayPair doesn't exist, create one and add it
                var newPair: KeyArrayPair<K, any> = {
                    key: key,
                    array: [elem]
                }
                result.push(newPair);
            } else {
                //Otherwise, add the element to the existing KeyArrayPair's array
                pair.array.push(elem);
            }
        }
        return result;
    }

    /**
    * Groups the elements of the array into KeyArrayPairs with each element's key provided by lambda(elem).
    * Identical to groupBy with optimizations made for string/number keys. Worst case runtime is O(n) as
    * opposed to groupBy's O(n^2).
    * @param lambda Method that generates the group/hash key from an element in the array
    * @returns An array of KeyArrayPair values with keys corresponding to the results of the provided lambda
    * and arrays of elements that map to respective keys
    */
    function groupByHash(array: Array<any>, lambda: (any) => string | number): Array<KeyArrayPair<string | number, any>> {
        var hashTable = {};

        for (var elem of array) {
            var key = lambda(elem);

            var pair = hashTable[key];
            if (!pair) {
                //If the KeyArrayPair doesn't exist, create one and add it
                var newPair: KeyArrayPair<string | number, any> = {
                    key: key,
                    array: [elem]
                }
                hashTable[key] = newPair;
            } else {
                //Otherwise, add the element to the existing KeyArrayPair hash table
                pair.array.push(elem);
            }
        }

        //Convert hash table to array and return it
        var result = [];
        for (var hash in hashTable) {
            result.push(hashTable[hash]);
        }
        return result;
    };
})();