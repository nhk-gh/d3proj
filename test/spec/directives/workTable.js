'use strict';

describe('Directive: workTable', function () {

  // load the directive's module
  beforeEach(module('d3projApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<work-table></work-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the workTable directive');
  }));
});
