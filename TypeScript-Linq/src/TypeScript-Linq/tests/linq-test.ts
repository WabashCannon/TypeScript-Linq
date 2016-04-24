
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

        var testGroupArray: ITarget[] = [
            { id: 0, name: 'apple' },
            { id: 0, name: 'bananna' },
            { id: 0, name: 'orange' },
            { id: 1, name: 'carrot' },
            { id: 1, name: 'squash' },
            { id: 1, name: 'corn' },
            { id: 2, name: 'milk' },
            { id: 2, name: 'cheese' }
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

        it('Array.first returns null for an empty array', () => {
            var target = [];
            expect(target.first()).toBeNull();
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

        it('Array.aggregate numeric summation works.', () => {
            var summationAggregate = (aggregate: number, target: ITarget) => {
                return aggregate + target.id;
            }
            var target = testArray.aggregate(summationAggregate);
            expect(target).toEqual(15);
        });

        it('Array.aggregate string joining works.', () => {
            var stringJoinAggregate = (aggregate: string, target: ITarget) => {
                if (aggregate == null) return target.name;
                return aggregate + ', ' + target.name;
            }
            var target = testArray.aggregate(stringJoinAggregate);
            expect(target).toEqual('apple, bananna, carrot, date, egg, fig');
        });

        it('Array.aggregate numeric summation with inital aggregate value works', () => {
            var summationAggregate = (aggregate: number, target: ITarget) => {
                return aggregate + target.id;
            }
            var target = testArray.aggregate(summationAggregate, 20);
            expect(target).toEqual(35);
        });

        it('Array.sum adds numeric array without predicate', () => {
            var testArray = [0, 1, 2, 3, 4, 5];
            var target = testArray.sum();
            expect(target).toEqual(15);
        });

        it('Array.sum adds numeric values with a lambda', () => {
            var getId = (elem: ITarget): number => elem.id;
            var target = testArray.sum(getId);
            expect(target).toEqual(15);
        });

        it('Array.sum adds string values with a lambda', () => {
            var getName = (elem: ITarget): string => elem.name;
            var target = testArray.sum(getName);
            expect(target).toEqual('applebanannacarrotdateeggfig');
        });

        it('Array.groupBy has correct number of groups', () => {
            var getId = (elem: ITarget): number => elem.id;
            var target = testGroupArray.groupBy(getId);

            expect(target.count()).toEqual(3);
        });

        it('Array.groupBy has correct groups', () => {
            var getId = (elem: ITarget): number => elem.id;
            var target = testGroupArray.groupBy(getId);

            //Define some utility functions for legible testing
            var groupHasKey = (key: number) => {
                return (group) => { return group.key == key; };
            };
            var targetHasId = (id: number) => {
                return (target) => { return target.id == id; };
            };
            var expectTargetToHaveCorrectGroup = (key: number) => {
                expect(
                    target
                        .first(groupHasKey(0))
                        .array
                ).toEqual(
                    testGroupArray
                        .where(targetHasId(0))
                    );
            };

            expectTargetToHaveCorrectGroup(0);
            expectTargetToHaveCorrectGroup(1);
            expectTargetToHaveCorrectGroup(2);
        });

        it('Array.groupBy non-hashable keys has correct groups', () => {
            //Define some non-hashable keys
            var groupKeys = [
                { id: 1 },
                { id: 2 },
                { id: 3 }
            ];

            //Map the test group array to have ids that are the non-hashable keys
            var testArray = testGroupArray.select(target => {
                return {
                    id: groupKeys[target.id],
                    name: target.name
                };
            });

            //Group by the non-hashable keys
            var getId = (elem: any): any => elem.id;
            var target = testArray.groupBy(getId);

            //Define some utility functions for legible testing
            var groupHasKey = (keyNum) => {
                return (group) => { return group.key == groupKeys[keyNum]; };
            };
            var targetHasId = (idNum) => {
                return (target) => { return target.id == groupKeys[idNum]; };
            };
            var expectTargetToHaveCorrectGroup = (key: number) => {
                expect(
                    target
                        .first(groupHasKey(0))
                        .array
                ).toEqual(
                    testArray
                        .where(targetHasId(0))
                    );
            };

            expectTargetToHaveCorrectGroup(0);
            expectTargetToHaveCorrectGroup(1);
            expectTargetToHaveCorrectGroup(2);
        });

        it('Array.groupBy non-hashable keys has correct groups when two keys are duck-type identical', () => {
            //Define some non-hashable keys
            var groupKeys = [
                { id: 1 },
                { id: 1 },
                { id: 2 }
            ];

            //Map the test group array to have ids that are the non-hashable keys
            var testArray = testGroupArray.select(target => {
                return {
                    id: groupKeys[target.id],
                    name: target.name
                };
            });

            //Group by the non-hashable keys
            var getId = (elem: any): any => elem.id;
            var target = testArray.groupBy(getId);

            //Define some utility functions for legible testing
            var groupHasKey = (keyNum) => {
                return (group) => { return group.key == groupKeys[keyNum]; };
            };
            var targetHasId = (idNum) => {
                return (target) => { return target.id == groupKeys[idNum]; };
            };
            var expectTargetToHaveCorrectGroup = (key: number) => {
                expect(
                    target
                        .first(groupHasKey(0))
                        .array
                ).toEqual(
                    testArray
                        .where(targetHasId(0))
                    );
            };

            expectTargetToHaveCorrectGroup(0);
            expectTargetToHaveCorrectGroup(1);
            expectTargetToHaveCorrectGroup(2);
        });
    });
