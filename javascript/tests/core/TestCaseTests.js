(function(){

    //for compatibility with both web and Node.js
    YUITest = (typeof require == "function") ? require("yuitest") : YUITest;

    var Assert          = YUITest.Assert,
        ObjectAssert    = YUITest.ObjectAssert;
    
    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------
    
    var suite = new YUITest.TestSuite("TestCase Tests");
    
 
    
    //-------------------------------------------------------------------------
    // Test Case for asserts
    //-------------------------------------------------------------------------
    
    suite.add(new YUITest.TestCase({
    
        name: "Assertion Tests",
        groups: ["core", "common"],
        
        "fail:Test should fail when there are no asserts": function(){
            //noop
        }
    }));        

    //-------------------------------------------------------------------------
    // Test Case for deprecated test failing annotation
    //-------------------------------------------------------------------------
    
    suite.add(new YUITest.TestCase({
    
        name: "Deprecated Assertion Tests",
        groups: ["core", "common"],
        
        _should: {
            fail: {
                "Test should fail when there are no asserts": true
            }
        },        
        
        "Test should fail when there are no asserts": function(){
            //noop
        }
    }));        

    //-------------------------------------------------------------------------
    // Test Case for init()
    //-------------------------------------------------------------------------
    
    var initValue = 0;
    suite.add(new YUITest.TestCase({
    
        name: "Init Tests",
        groups: ["core", "common"],
        
        init: function(){
            initValue++;
        },     
        
        "Verify that initValue is 1": function(){
            Assert.areEqual(1, initValue);
        },
        
        "Verify that initValue is still 1": function(){
            Assert.areEqual(1, initValue);
        }        
        
    }));        

    //-------------------------------------------------------------------------
    // Test Case for ignore annotation
    //-------------------------------------------------------------------------
    
    var ignoreValue = 0;
    suite.add(new YUITest.TestCase({
    
        name: "Ignore Tests",
        groups: ["core", "common"],
        
        "ignore:This test should be ignored": function(){
            ignoreValue = 5;
        },
        
        //fragile
        "Verify that ignoreValue has not changed": function(){
            Assert.areEqual(0, ignoreValue);
        }        
        
    }));        

    //-------------------------------------------------------------------------
    // Test Case for async:init()
    //-------------------------------------------------------------------------
    
    var asyncInitValue = 0;
    suite.add(new YUITest.TestCase({
    
        name: "Async Init Tests",
        groups: ["core", "common"],
        
        "async:init": function(){
            var that = this;
            asyncInitValue = 1;
            setTimeout(function(){
                asyncInitValue = 3;
                that.callback("myVal")(25);
            },100);
        },     
        
        "Verify that context data has a property named 'myVal'": function(data){
            ObjectAssert.hasKey("myVal", data);
            Assert.areEqual(25, data.myVal);
        },
        
        "Verify that asyncInitValue is 3": function(){
            Assert.areEqual(3, asyncInitValue);
        },
        
        "Verify that initValue is still 3": function(){
            Assert.areEqual(3, asyncInitValue);
        }        
        
    }));        

    //-------------------------------------------------------------------------
    // Test Case for destroy()
    //-------------------------------------------------------------------------
    
    var destroyValue = 0;
    suite.add(new YUITest.TestCase({
    
        name: "Destroy Tests",
        groups: ["core", "common"],
        
        
        tearDown: function(){
            destroyValue++;
        },
        
        destroy: function(){
            destroyValue--;
        },  
         
        "Verify that destroyValue is 0": function(){
            Assert.areEqual(0, destroyValue);
        },
        
        "Verify that initValue is 1": function(){
            Assert.areEqual(1, destroyValue);
        }        
        
    }));        

    //this case verifies the result of the last case
    suite.add(new YUITest.TestCase({
    
        name: "Destroy Verification Tests",
        groups: ["core", "common"],
         
        "Verify that destroyValue is 1": function(){
            Assert.areEqual(1, destroyValue);
        }    
        
    }));        
    
    //-------------------------------------------------------------------------
    // Test Case for visitor data object
    //-------------------------------------------------------------------------
    
    
    var visitorSuite = new YUITest.TestSuite({
        name: "Visitor data tests",
        groups: ["core", "common"],
        
        setUp: function(data){
            data.foo = "bar";
        }
        
    });
    
    visitorSuite.add(new YUITest.TestCase({
    
        name: "First Test Case",
        groups: ["core", "common"],
        
        init: function(data){
            data.first = 1;
        },
        
        setUp: function(data){
            data.test = true;
        },
        
        tearDown: function(data){
            delete data.test;
        },
         
        "The property 'foo' should be passed from the suite and be 'bar'": function(data){
            Assert.areEqual("bar", data.foo);
        },
        
        "The property 'test' should be passed from setUp and be true": function(data){
            Assert.isTrue(data.test);
        },        
        
        "The property 'first' should be passed from init and be 1": function(data){
            Assert.areEqual(1, data.first);
        }        
        
    }));    

    visitorSuite.add(new YUITest.TestCase({
    
        name: "Second Test Case",
        groups: ["core", "common"],
    
       "The property 'foo' should be passed from the suite and be 'bar'": function(data){
            Assert.areEqual("bar", data.foo);
        },
        
        "The property 'first' should be passed from init and be 1": function(data){
            Assert.areEqual(1, data.first);
        }     
    }));
    
    suite.add(visitorSuite);
    
   //-------------------------------------------------------------------------
    // Test Case for wait/resume()
    //-------------------------------------------------------------------------
    
    suite.add(new YUITest.TestCase({
    
        name: "wait()/resume() Tests",
        groups: ["core", "common"],     
        
        "wait() with a function to execute should work": function(){
            this.wait(function(){
                Assert.pass();
            }, 100);
        },
        
        "wait() without a function to execute followed by resume() should work": function(){
            var that = this;
            setTimeout(function(){
                that.resume(function(){
                    Assert.pass();
                });
            }, 0);
            
            this.wait(100);
        },
        
        "fail:wait() without resume() should fail": function () {
            Assert.pass();
            this.wait(100);
        },
        
        "resume() without wait() should throw an error": function () {
            var that = this;
            Assert.throwsError("resume() called without wait().", function(){
                that.resume(function(){});
            });
        }
    }));            

    suite.add(new YUITest.TestCase({
        name: 'waitFor',

        _should: {
            fail: {
                'waitFor() without params should fail': true,
                'waitFor(nonFn, fn) should fail': true,
                'waitFor(fn, nonFn) should fail': true,
                'waitFor(falseFn, fn) should fail': true,
                'waitFor(trueFn, failFn) should fail': true,
                'waitFor(falseFn, yfn, smallTimeout) should fail before default wait time': true
            }
        },

        'waitFor() without params should fail': function () {
            this.waitFor();
        },

        'waitFor(nonFn, fn) should fail': function () {
            this.waitFor('boom', function () {});
        },

        'waitFor(fn, nonFn) should fail': function () {
            this.waitFor(function () {}, 'boom');
        },

        '`this` in waitFor(HERE, fn) should be the TestCase': function () {
            var self = this,
                conditionThis;

            self.waitFor(function () {
                conditionThis = this;
                return true;
            }, function () {
                self.assert(self === conditionThis);
            });
        },

        '`this` in waitFor(fn, HERE) should be the TestCase': function () {
            var self = this;

            self.waitFor(function () { return true; }, function () {
                self.assert(self === this);
            });
        },

        'waitFor(falseFn, fn) should fail': function () {
            this.waitFor(function () { return false; }, function () {
                this.assert(true);
            });
        },

        'waitFor(trueFn, failFn) should fail': function () {
            this.waitFor(function () { return true; }, function () {
                this.fail('failure === success!');
            });
        },

        'waitFor(xfn, yfn) should call xfn multiple times until it returns true': function () {
            var remaining = 3;

            this.waitFor(function () {
                return !(--remaining);
            }, function () {
                this.assert(remaining === 0, 'waitFor() conditional function called ' + remaining + ' fewer times than expected');
            });
        },

        // FIXME: This is an unreliable test because if the process is so busy
        // that it can't free up a tick to call teh condition before the
        // default 10s is up, the test will fail, which is an indicator of
        // success. So, false positive. I can't think of a better way to test
        // this, though, and it seems pretty unlikely to end up "failing" in
        // that way, so here it is.
        'waitFor(falseFn, yfn, smallTimeout) should fail before default wait time': function () {
            var tooLate = (+new Date()) + 2000,
                called;

            this.waitFor(function () {
                if (called && (+new Date()) > tooLate) {
                    // Pass === fail
                    this.assert('condition called well past specified timeout');
                }

                // Hack to avoid race condition with busy event loop not
                // freeing up a tick before the full 10s wait timeout. The
                // hope is that if the process isn't so bogged down that it
                // can call the condition once, it can call it multiple times.
                called = true;

                return false;
            }, function () {
                // Pass === fail
                this.assert('segment should not have been called');
            }, 300);
        },

        // FIXME: This is a textbook race condition. It may fail due to process
        // load interfering with event loop fidelity. If you can think of a
        // better way to test it, please do so. Otherwise, if you think this
        // shouldn't even be here, please comment it out so there's a history
        // of the issue being avoided.
        'waitFor(xfn, fn, null, smallIncrement) should call xfn more frequently than default increment': function () {
            var firstPass = 0,
                secondPass = 0,
                milestoneReached;

            setTimeout(function () {
                milestoneReached = true;
            }, 1000);

            this.waitFor(function () {
                firstPass++;

                return milestoneReached;
            }, function () {
                milestoneReached = false;

                setTimeout(function () {
                    milestoneReached = true;
                }, 1000);

                this.waitFor(function () {
                    secondPass++;

                    return milestoneReached;
                }, function () {
                    // TODO: can this be refined in a reasonable way? This is
                    // pretty arbitrary
                    this.assert(firstPass > (secondPass * 1.5));
                }, null, 200);
            }, null, 20);
        }

    }));

    //add it to be run
    YUITest.TestRunner.add(suite);

})();