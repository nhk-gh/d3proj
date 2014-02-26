'use strict';

describe('Service: Dociconsize', function () {

  // load the service's module
  beforeEach(module('d3projApp'));

  // instantiate service
  var Dociconsize;
  beforeEach(inject(function (_Dociconsize_) {
    Dociconsize = _Dociconsize_;
  }));

  it('should do something', function () {
    expect(!!Dociconsize).toBe(true);
  });

});
