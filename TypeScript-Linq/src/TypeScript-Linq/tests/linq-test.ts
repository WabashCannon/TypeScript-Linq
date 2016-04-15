
describe('Linq Tests',
    () => {
        interface ITarget {
            id: number;
            name: string;
        }

        var testArray: ITarget[] = [
            { id: 0, name: 'apple' },
            { id: 1, name: 'bananna' },
            { id: 2, name: 'carrot' },
            { id: 3, name: 'date' },
            { id: 4, name: 'egg' },
            { id: 5, name: 'fig' }
        ];

        it('Array.remove removes an item.', () => {

            var ta: ITarget[] = [
                { id: 0, name: 'apple' },
                { id: 1, name: 'bananna' },
                { id: 2, name: 'carrot' },
                { id: 3, name: 'date' },
                { id: 4, name: 'egg' },
                { id: 5, name: 'fig' }
            ];

            var toBeRemoved = ta[3];
            ta.remove(toBeRemoved);
            expect(ta.length).toEqual(5);
        });

        it('Array.remove removes the correct item.', () => {

            var ta: ITarget[] = [
                { id: 0, name: 'apple' },
                { id: 1, name: 'bananna' },
                { id: 2, name: 'carrot' },
                { id: 3, name: 'date' },
                { id: 4, name: 'egg' },
                { id: 5, name: 'fig' }
            ];

            var toBeRemoved = ta[3];
            ta.remove(toBeRemoved);
            var ndx = ta.indexOf(toBeRemoved);
            expect(ndx).toEqual(-1);
        });

        it('Array.single returns the record if there is only one.', () => {
            var a: ITarget[] = [
                { id: 0, name: 'apple' }
            ];

            var target = a.single();
            expect(target.id).toEqual(0);
        });

        it('Array.single throws exception if there are no records', () => {
            expect(() => {
                var a: ITarget[] = [];
                var target = a.single();
            }).toThrow('Collection has no items.');
        });


        it('Array.single throws exception if there are more than one records', () => {
            expect(() => {
                var target = testArray.single();
            }).toThrow('Collection has more than one item.');
        });

        it('Array.first returns correct element.', () => {
            var target = testArray.first(x => x.name === 'date');
            expect(target.id).toEqual(3);
        });

        it('Array.first returns null when predicate matches nothing.', () => {
            var target = testArray.first(() => false);
            expect(target).toBeNull();
        });

        it('Array.indexOfFirst returns correct index.', () => {
            var target = testArray.indexOfFirst(x => x.name === 'date');
            expect(target).toEqual(3);
        });

        it('Array.indexOfFirst returns -1 when predicate matches nothing.', () => {
            var target = testArray.indexOfFirst(() => false);
            expect(target).toEqual(-1);
        });

        it('Array.any returns true when predicate matches one element', () => {
            var target = testArray.any(x => x.name === 'date');
            expect(target).toBeTruthy();
        });

        it('Array.any returns true when predicate matches more than one element', () => {
            var target = testArray.any(x => x.name === 'date' || x.name === 'egg');
            expect(target).toBeTruthy();
        });

        it('Array.any returns false when predicate matches zero elements', () => {
            var target = testArray.any(x => false);
            expect(target).toBeFalsy();
        });

        it('Array.select returns an array whose length is equal to the original array.', () => {
            var target = testArray.select(x => x.id) as number[];
            expect(target.length).toEqual(testArray.length);
        });

        it('Array.select returns an array numbers when numbers are selected by the lambda function.', () => {
            var target = testArray.select(x => x.id);
            expect(target[0]).toEqual(jasmine.any(Number));
        });

        it('Array.select returns an array strings when strings are selected by the lambda function.', () => {
            var target = testArray.select(x => x.name);
            expect(target[0]).toEqual(jasmine.any(String));
        });

        it('Array.where returns an array of items specified by a predicate', () => {
            var target = testArray.where(x => x.name[1] === 'a') as any[];
            expect(target.length).toEqual(3);
        });

        it('Array.distinct returns an array of items distinct as specified by a predicate', () => {
            var target = testArray.distinct((a, b) => a.name[1] === b.name[1]) as any[];
            expect(target.length).toEqual(4);
        });

        it('Array.distinct returns an array of distinct items when no predicate is specified', () => {
            var localArray = testArray.slice(0);
            localArray.push(testArray[0]);
            localArray.push(testArray[1]);
            expect(localArray.length).toEqual(8);

            var target = localArray.distinct() as any[];
            expect(target.length).toEqual(6);
        });


        it('Array.count returns the number of items that match a predicate', () => {
            var target = testArray.count(x => x.name[1] === 'a');
            expect(target).toEqual(3);
        });

        it('Array.count returns the length of the array if no predicate is specified', () => {
            var target = testArray.count();
            expect(target).toEqual(6);
        });

    });
