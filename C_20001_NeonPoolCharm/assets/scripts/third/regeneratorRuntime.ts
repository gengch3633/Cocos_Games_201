function _typeof(e: any): string {
    return typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
        ? function (val: any) {
              return typeof val;
          }
        : function (val: any) {
              return val && typeof Symbol === "function" && val.constructor === Symbol && val !== Symbol.prototype
                  ? "symbol"
                  : typeof val;
          })(e);
}

(function () {
    const runtime = ((window as any).regeneratorRuntime = {});
    const prototype = Object.prototype;
    const hasOwn = prototype.hasOwnProperty;
    const defineProperty =
        Object.defineProperty ||
        function (obj: any, key: string, desc: PropertyDescriptor) {
            obj[key] = desc.value;
        };
    const SymbolObj = typeof Symbol === "function" ? Symbol : ({} as any);
    const iterator = SymbolObj.iterator || "@@iterator";
    const asyncIterator = SymbolObj.asyncIterator || "@@asyncIterator";
    const toStringTag = SymbolObj.toStringTag || "@@toStringTag";

    let defineImpl = function (obj: any, key: string, val: any) {
        return Object.defineProperty(obj, key, {
            value: val,
            enumerable: true,
            configurable: true,
            writable: true,
        }), obj[key];
    };

    try {
        defineImpl({}, "");
    } catch (e) {
        defineImpl = function (obj: any, key: string, val: any) {
            return (obj[key] = val);
        };
    }

    function wrap(innerFn: any, outerFn: any, self: any, tryLocsList: any) {
        const proto = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        const generator = Object.create(proto.prototype);
        const context = new Context(tryLocsList || []);
        defineProperty(generator, "_invoke", {
            value: makeInvokeMethod(innerFn, outerFn, context),
        });
        return generator;
    }

    function tryCatch(fn: any, obj: any, arg: any) {
        try {
            return { type: "normal", arg: fn.call(obj, arg) };
        } catch (e) {
            return { type: "throw", arg: e };
        }
    }

    runtime.wrap = wrap;

    const ContinueSentinel = {};

    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    const IteratorPrototype: any = {};
    defineImpl(IteratorPrototype, iterator, function () {
        return this;
    });

    const getProto = Object.getPrototypeOf;
    let iteratorProto: any = IteratorPrototype;
    const NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== prototype && hasOwn.call(NativeIteratorPrototype, iterator)) {
        iteratorProto = NativeIteratorPrototype;
    }

    const Gp: any = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(iteratorProto));

    function defineIteratorMethods(prototypeObj: any) {
        ["next", "throw", "return"].forEach(function (method) {
            defineImpl(prototypeObj, method, function (arg: any) {
                return this._invoke(method, arg);
            });
        });
    }

    function AsyncIterator(generator: any, PromiseImpl: any) {
        function invoke(method: string, arg: any, resolve: any, reject: any) {
            const record = tryCatch(generator[method], generator, arg);
            if (record.type === "throw") {
                reject(record.arg);
            } else {
                const result = record.arg;
                const value = result.value;
                if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
                    return PromiseImpl.resolve(value.__await).then(
                        function (val: any) {
                            invoke("next", val, resolve, reject);
                        },
                        function (err: any) {
                            invoke("throw", err, resolve, reject);
                        },
                    );
                }
                return PromiseImpl.resolve(value).then(
                    function (unwrapped: any) {
                        result.value = unwrapped;
                        resolve(result);
                    },
                    function (err: any) {
                        return invoke("throw", err, resolve, reject);
                    },
                );
            }
        }

        let previousPromise: any;

        defineProperty(this, "_invoke", {
            value: function (method: string, arg: any) {
                function callInvokeWithMethodAndArg() {
                    return new PromiseImpl(function (resolve, reject) {
                        invoke(method, arg, resolve, reject);
                    });
                }
                return (previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg());
            },
        });
    }

    function makeInvokeMethod(innerFn: any, outerFn: any, context: any) {
        let state = "suspendedStart";

        return function invoke(method: string, arg: any) {
            if (state === "executing") {
                throw new Error("Generator is already running");
            }
            if (state === "completed") {
                if (method === "throw") {
                    throw arg;
                }
                return { value: void 0, done: true };
            }
            context.method = method;
            context.arg = arg;
            for (;;) {
                const delegate = context.delegate;
                if (delegate) {
                    const delegateResult = maybeInvokeDelegate(delegate, context);
                    if (delegateResult) {
                        if (delegateResult === ContinueSentinel) {
                            continue;
                        }
                        return delegateResult;
                    }
                }
                if (context.method === "next") {
                    context.sent = context._sent = context.arg;
                } else if (context.method === "throw") {
                    if (state === "suspendedStart") {
                        state = "completed";
                        throw context.arg;
                    }
                    context.dispatchException(context.arg);
                } else if (context.method === "return") {
                    context.abrupt("return", context.arg);
                }
                state = "executing";
                const record = tryCatch(innerFn, outerFn, context);
                if (record.type === "normal") {
                    state = context.done ? "completed" : "suspendedYield";
                    if (record.arg === ContinueSentinel) {
                        continue;
                    }
                    return { value: record.arg, done: context.done };
                }
                if (record.type === "throw") {
                    state = "completed";
                    context.method = "throw";
                    context.arg = record.arg;
                }
            }
        };
    }

    function maybeInvokeDelegate(delegate: any, context: any) {
        const methodName = context.method;
        const iteratorMethod = delegate.iterator[methodName];
        if (iteratorMethod === void 0) {
            context.delegate = null;
            if (methodName === "throw" && delegate.iterator.return) {
                context.method = "return";
                context.arg = void 0;
                maybeInvokeDelegate(delegate, context);
                if (context.method === "throw") {
                    return ContinueSentinel;
                }
            }
            if (methodName !== "return") {
                context.method = "throw";
                context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method");
            }
            return ContinueSentinel;
        }
        const record = tryCatch(iteratorMethod, delegate.iterator, context.arg);
        if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
        }
        const info = record.arg;
        if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
        }
        if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
            if (context.method !== "return") {
                context.method = "next";
                context.arg = void 0;
            }
            context.delegate = null;
            return ContinueSentinel;
        }
        return info;
    }

    function pushTryEntry(tryLoc: any) {
        const entry: any = { tryLoc: tryLoc[0] };
        if (1 in tryLoc) {
            entry.catchLoc = tryLoc[1];
        }
        if (2 in tryLoc) {
            entry.finallyLoc = tryLoc[2];
            entry.afterLoc = tryLoc[3];
        }
        this.tryEntries.push(entry);
    }

    function resetTryEntry(entry: any) {
        const completion = entry.completion || {};
        completion.type = "normal";
        delete completion.arg;
        entry.completion = completion;
    }

    function Context(tryLocsList: any[]) {
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
    }

    function values(iterable: any) {
        if (iterable) {
            const iteratorMethod = iterable[iterator];
            if (iteratorMethod) {
                return iteratorMethod.call(iterable);
            }
            if (typeof iterable.next === "function") {
                return iterable;
            }
            if (!isNaN(iterable.length)) {
                let i = -1;
                const next = function nextMethod() {
                    for (;;) {
                        if (++i >= iterable.length) {
                            return { value: void 0, done: true };
                        }
                        if (hasOwn.call(iterable, i)) {
                            return { value: iterable[i], done: false };
                        }
                    }
                };
                return (next.next = next);
            }
        }
        return { next: doneResult };
    }

    function doneResult() {
        return { value: void 0, done: true };
    }

    GeneratorFunctionPrototype.prototype = GeneratorFunctionPrototype;
    defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
    defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: true });
    GeneratorFunction.displayName = defineImpl(GeneratorFunctionPrototype, toStringTag, "GeneratorFunction");

    runtime.isGeneratorFunction = function (fn: any) {
        const ctor = typeof fn === "function" && fn.constructor;
        return !!ctor && (ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction");
    };

    runtime.mark = function (genFun: any) {
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            defineImpl(genFun, toStringTag, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
    };

    runtime.awrap = function (arg: any) {
        return { __await: arg };
    };

    defineIteratorMethods(AsyncIterator.prototype);
    defineImpl(AsyncIterator.prototype, asyncIterator, function () {
        return this;
    });
    runtime.AsyncIterator = AsyncIterator;
    runtime.async = function (innerFn: any, outerFn: any, self: any, tryLocsList: any, PromiseImpl?: any) {
        if (PromiseImpl === void 0) {
            PromiseImpl = Promise;
        }
        const iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return runtime.isGeneratorFunction(outerFn)
            ? iter
            : iter.next().then(function (result: any) {
                  return result.done ? result.value : iter.next();
              });
    };

    defineIteratorMethods(Gp);
    defineImpl(Gp, toStringTag, "Generator");
    defineImpl(Gp, iterator, function () {
        return this;
    });
    defineImpl(Gp, "toString", function () {
        return "[object Generator]";
    });

    runtime.keys = function (val: any) {
        const object = Object(val);
        const keys: string[] = [];
        for (const key in object) {
            keys.push(key);
        }
        keys.reverse();
        return function next() {
            for (; keys.length; ) {
                const key = keys.pop();
                if (key in object) {
                    return { value: key, done: false };
                }
            }
            return { done: true, value: void 0 };
        };
    };

    runtime.values = values;

    Context.prototype = {
        constructor: Context,
        reset(skipTempReset: boolean) {
            this.prev = 0;
            this.next = 0;
            this.sent = this._sent = void 0;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = void 0;
            this.tryEntries.forEach(resetTryEntry);
            if (!skipTempReset) {
                for (const key in this) {
                    if (key.charAt(0) === "t" && hasOwn.call(this, key) && !isNaN(+key.slice(1))) {
                        this[key] = void 0;
                    }
                }
            }
        },
        stop() {
            this.done = true;
            const completion = this.tryEntries[0].completion;
            if (completion.type === "throw") {
                throw completion.arg;
            }
            return this.rval;
        },
        dispatchException(exception: any) {
            if (this.done) {
                throw exception;
            }
            const context = this;
            function handle(loc: any, caught: boolean) {
                record.type = "throw";
                record.arg = exception;
                context.next = loc;
                if (caught) {
                    context.method = "next";
                    context.arg = void 0;
                }
                return !!caught;
            }
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
                const entry = this.tryEntries[i];
                const record = entry.completion;
                if (entry.tryLoc === "root") {
                    return handle("end");
                }
                if (entry.tryLoc <= this.prev) {
                    const hasCatch = hasOwn.call(entry, "catchLoc");
                    const hasFinally = hasOwn.call(entry, "finallyLoc");
                    if (hasCatch && hasFinally) {
                        if (this.prev < entry.catchLoc) {
                            return handle(entry.catchLoc, true);
                        }
                        if (this.prev < entry.finallyLoc) {
                            return handle(entry.finallyLoc);
                        }
                    } else if (hasCatch) {
                        if (this.prev < entry.catchLoc) {
                            return handle(entry.catchLoc, true);
                        }
                    } else {
                        if (!hasFinally) {
                            throw new Error("try statement without catch or finally");
                        }
                        if (this.prev < entry.finallyLoc) {
                            return handle(entry.finallyLoc);
                        }
                    }
                }
            }
        },
        abrupt(type: string, arg: any) {
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
                const entry = this.tryEntries[i];
                if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                    var finallyEntry = entry;
                    break;
                }
            }
            if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                finallyEntry = null;
            }
            const record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;
            if (finallyEntry) {
                this.method = "next";
                this.next = finallyEntry.finallyLoc;
                return ContinueSentinel;
            }
            return this.complete(record);
        },
        complete(record: any, afterLoc?: any) {
            if (record.type === "throw") {
                throw record.arg;
            }
            if (record.type === "break" || record.type === "continue") {
                this.next = record.arg;
            } else if (record.type === "return") {
                this.rval = this.arg = record.arg;
                this.method = "return";
                this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
                this.next = afterLoc;
            }
            return ContinueSentinel;
        },
        finish(finallyLoc: any) {
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
                const entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc) {
                    this.complete(entry.completion, entry.afterLoc);
                    resetTryEntry(entry);
                    return ContinueSentinel;
                }
            }
        },
        catch(tryLoc: any) {
            for (let i = this.tryEntries.length - 1; i >= 0; --i) {
                const entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                    const record = entry.completion;
                    if (record.type === "throw") {
                        const thrown = record.arg;
                        resetTryEntry(entry);
                        return thrown;
                    }
                }
            }
            throw new Error("illegal catch attempt");
        },
        delegateYield(iterable: any, resultName: string, nextLoc: any) {
            this.delegate = {
                iterator: values(iterable),
                resultName,
                nextLoc,
            };
            if (this.method === "next") {
                this.arg = void 0;
            }
            return ContinueSentinel;
        },
    };
})();
