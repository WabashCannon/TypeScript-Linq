export {};

type predicate<T> = (T) => boolean;


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
    if (!lambda && length > 0) {
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