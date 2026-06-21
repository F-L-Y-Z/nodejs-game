(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e2) {
      throw mod = 0, e2;
    }
  };
  var __copyProps = (to2, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to2, key) && key !== except)
          __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to2;
  };
  var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

  // ../../node_modules/.pnpm/cross-fetch@4.1.0/node_modules/cross-fetch/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "../../node_modules/.pnpm/cross-fetch@4.1.0/node_modules/cross-fetch/dist/browser-polyfill.js"(exports) {
      (function(self2) {
        var irrelevant = (function(exports2) {
          var g2 = typeof globalThis !== "undefined" && globalThis || typeof self2 !== "undefined" && self2 || // eslint-disable-next-line no-undef
          typeof global !== "undefined" && global || {};
          var support = {
            searchParams: "URLSearchParams" in g2,
            iterable: "Symbol" in g2 && "iterator" in Symbol,
            blob: "FileReader" in g2 && "Blob" in g2 && (function() {
              try {
                new Blob();
                return true;
              } catch (e2) {
                return false;
              }
            })(),
            formData: "FormData" in g2,
            arrayBuffer: "ArrayBuffer" in g2
          };
          function isDataView(obj) {
            return obj && DataView.prototype.isPrototypeOf(obj);
          }
          if (support.arrayBuffer) {
            var viewClasses = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]"
            ];
            var isArrayBufferView = ArrayBuffer.isView || function(obj) {
              return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
            };
          }
          function normalizeName(name) {
            if (typeof name !== "string") {
              name = String(name);
            }
            if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
              throw new TypeError('Invalid character in header field name: "' + name + '"');
            }
            return name.toLowerCase();
          }
          function normalizeValue(value) {
            if (typeof value !== "string") {
              value = String(value);
            }
            return value;
          }
          function iteratorFor(items) {
            var iterator = {
              next: function() {
                var value = items.shift();
                return { done: value === void 0, value };
              }
            };
            if (support.iterable) {
              iterator[Symbol.iterator] = function() {
                return iterator;
              };
            }
            return iterator;
          }
          function Headers2(headers) {
            this.map = {};
            if (headers instanceof Headers2) {
              headers.forEach(function(value, name) {
                this.append(name, value);
              }, this);
            } else if (Array.isArray(headers)) {
              headers.forEach(function(header) {
                if (header.length != 2) {
                  throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + header.length);
                }
                this.append(header[0], header[1]);
              }, this);
            } else if (headers) {
              Object.getOwnPropertyNames(headers).forEach(function(name) {
                this.append(name, headers[name]);
              }, this);
            }
          }
          Headers2.prototype.append = function(name, value) {
            name = normalizeName(name);
            value = normalizeValue(value);
            var oldValue = this.map[name];
            this.map[name] = oldValue ? oldValue + ", " + value : value;
          };
          Headers2.prototype["delete"] = function(name) {
            delete this.map[normalizeName(name)];
          };
          Headers2.prototype.get = function(name) {
            name = normalizeName(name);
            return this.has(name) ? this.map[name] : null;
          };
          Headers2.prototype.has = function(name) {
            return this.map.hasOwnProperty(normalizeName(name));
          };
          Headers2.prototype.set = function(name, value) {
            this.map[normalizeName(name)] = normalizeValue(value);
          };
          Headers2.prototype.forEach = function(callback, thisArg) {
            for (var name in this.map) {
              if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
              }
            }
          };
          Headers2.prototype.keys = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push(name);
            });
            return iteratorFor(items);
          };
          Headers2.prototype.values = function() {
            var items = [];
            this.forEach(function(value) {
              items.push(value);
            });
            return iteratorFor(items);
          };
          Headers2.prototype.entries = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push([name, value]);
            });
            return iteratorFor(items);
          };
          if (support.iterable) {
            Headers2.prototype[Symbol.iterator] = Headers2.prototype.entries;
          }
          function consumed(body) {
            if (body._noBody) return;
            if (body.bodyUsed) {
              return Promise.reject(new TypeError("Already read"));
            }
            body.bodyUsed = true;
          }
          function fileReaderReady(reader) {
            return new Promise(function(resolve, reject) {
              reader.onload = function() {
                resolve(reader.result);
              };
              reader.onerror = function() {
                reject(reader.error);
              };
            });
          }
          function readBlobAsArrayBuffer(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsArrayBuffer(blob);
            return promise;
          }
          function readBlobAsText(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
            var encoding = match ? match[1] : "utf-8";
            reader.readAsText(blob, encoding);
            return promise;
          }
          function readArrayBufferAsText(buf) {
            var view2 = new Uint8Array(buf);
            var chars = new Array(view2.length);
            for (var i2 = 0; i2 < view2.length; i2++) {
              chars[i2] = String.fromCharCode(view2[i2]);
            }
            return chars.join("");
          }
          function bufferClone(buf) {
            if (buf.slice) {
              return buf.slice(0);
            } else {
              var view2 = new Uint8Array(buf.byteLength);
              view2.set(new Uint8Array(buf));
              return view2.buffer;
            }
          }
          function Body() {
            this.bodyUsed = false;
            this._initBody = function(body) {
              this.bodyUsed = this.bodyUsed;
              this._bodyInit = body;
              if (!body) {
                this._noBody = true;
                this._bodyText = "";
              } else if (typeof body === "string") {
                this._bodyText = body;
              } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
              } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
              } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
              } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
              } else {
                this._bodyText = body = Object.prototype.toString.call(body);
              }
              if (!this.headers.get("content-type")) {
                if (typeof body === "string") {
                  this.headers.set("content-type", "text/plain;charset=UTF-8");
                } else if (this._bodyBlob && this._bodyBlob.type) {
                  this.headers.set("content-type", this._bodyBlob.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                  this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                }
              }
            };
            if (support.blob) {
              this.blob = function() {
                var rejected = consumed(this);
                if (rejected) {
                  return rejected;
                }
                if (this._bodyBlob) {
                  return Promise.resolve(this._bodyBlob);
                } else if (this._bodyArrayBuffer) {
                  return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                } else if (this._bodyFormData) {
                  throw new Error("could not read FormData body as blob");
                } else {
                  return Promise.resolve(new Blob([this._bodyText]));
                }
              };
            }
            this.arrayBuffer = function() {
              if (this._bodyArrayBuffer) {
                var isConsumed = consumed(this);
                if (isConsumed) {
                  return isConsumed;
                } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
                  return Promise.resolve(
                    this._bodyArrayBuffer.buffer.slice(
                      this._bodyArrayBuffer.byteOffset,
                      this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                    )
                  );
                } else {
                  return Promise.resolve(this._bodyArrayBuffer);
                }
              } else if (support.blob) {
                return this.blob().then(readBlobAsArrayBuffer);
              } else {
                throw new Error("could not read as ArrayBuffer");
              }
            };
            this.text = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as text");
              } else {
                return Promise.resolve(this._bodyText);
              }
            };
            if (support.formData) {
              this.formData = function() {
                return this.text().then(decode3);
              };
            }
            this.json = function() {
              return this.text().then(JSON.parse);
            };
            return this;
          }
          var methods = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
          function normalizeMethod(method) {
            var upcased = method.toUpperCase();
            return methods.indexOf(upcased) > -1 ? upcased : method;
          }
          function Request(input, options) {
            if (!(this instanceof Request)) {
              throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
            }
            options = options || {};
            var body = options.body;
            if (input instanceof Request) {
              if (input.bodyUsed) {
                throw new TypeError("Already read");
              }
              this.url = input.url;
              this.credentials = input.credentials;
              if (!options.headers) {
                this.headers = new Headers2(input.headers);
              }
              this.method = input.method;
              this.mode = input.mode;
              this.signal = input.signal;
              if (!body && input._bodyInit != null) {
                body = input._bodyInit;
                input.bodyUsed = true;
              }
            } else {
              this.url = String(input);
            }
            this.credentials = options.credentials || this.credentials || "same-origin";
            if (options.headers || !this.headers) {
              this.headers = new Headers2(options.headers);
            }
            this.method = normalizeMethod(options.method || this.method || "GET");
            this.mode = options.mode || this.mode || null;
            this.signal = options.signal || this.signal || (function() {
              if ("AbortController" in g2) {
                var ctrl = new AbortController();
                return ctrl.signal;
              }
            })();
            this.referrer = null;
            if ((this.method === "GET" || this.method === "HEAD") && body) {
              throw new TypeError("Body not allowed for GET or HEAD requests");
            }
            this._initBody(body);
            if (this.method === "GET" || this.method === "HEAD") {
              if (options.cache === "no-store" || options.cache === "no-cache") {
                var reParamSearch = /([?&])_=[^&]*/;
                if (reParamSearch.test(this.url)) {
                  this.url = this.url.replace(reParamSearch, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
                } else {
                  var reQueryString = /\?/;
                  this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
                }
              }
            }
          }
          Request.prototype.clone = function() {
            return new Request(this, { body: this._bodyInit });
          };
          function decode3(body) {
            var form = new FormData();
            body.trim().split("&").forEach(function(bytes) {
              if (bytes) {
                var split = bytes.split("=");
                var name = split.shift().replace(/\+/g, " ");
                var value = split.join("=").replace(/\+/g, " ");
                form.append(decodeURIComponent(name), decodeURIComponent(value));
              }
            });
            return form;
          }
          function parseHeaders(rawHeaders) {
            var headers = new Headers2();
            var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
            preProcessedHeaders.split("\r").map(function(header) {
              return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
            }).forEach(function(line) {
              var parts = line.split(":");
              var key = parts.shift().trim();
              if (key) {
                var value = parts.join(":").trim();
                try {
                  headers.append(key, value);
                } catch (error) {
                  console.warn("Response " + error.message);
                }
              }
            });
            return headers;
          }
          Body.call(Request.prototype);
          function Response(bodyInit, options) {
            if (!(this instanceof Response)) {
              throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
            }
            if (!options) {
              options = {};
            }
            this.type = "default";
            this.status = options.status === void 0 ? 200 : options.status;
            if (this.status < 200 || this.status > 599) {
              throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
            }
            this.ok = this.status >= 200 && this.status < 300;
            this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
            this.headers = new Headers2(options.headers);
            this.url = options.url || "";
            this._initBody(bodyInit);
          }
          Body.call(Response.prototype);
          Response.prototype.clone = function() {
            return new Response(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new Headers2(this.headers),
              url: this.url
            });
          };
          Response.error = function() {
            var response = new Response(null, { status: 200, statusText: "" });
            response.ok = false;
            response.status = 0;
            response.type = "error";
            return response;
          };
          var redirectStatuses = [301, 302, 303, 307, 308];
          Response.redirect = function(url, status) {
            if (redirectStatuses.indexOf(status) === -1) {
              throw new RangeError("Invalid status code");
            }
            return new Response(null, { status, headers: { location: url } });
          };
          exports2.DOMException = g2.DOMException;
          try {
            new exports2.DOMException();
          } catch (err) {
            exports2.DOMException = function(message, name) {
              this.message = message;
              this.name = name;
              var error = Error(message);
              this.stack = error.stack;
            };
            exports2.DOMException.prototype = Object.create(Error.prototype);
            exports2.DOMException.prototype.constructor = exports2.DOMException;
          }
          function fetch(input, init) {
            return new Promise(function(resolve, reject) {
              var request = new Request(input, init);
              if (request.signal && request.signal.aborted) {
                return reject(new exports2.DOMException("Aborted", "AbortError"));
              }
              var xhr = new XMLHttpRequest();
              function abortXhr() {
                xhr.abort();
              }
              xhr.onload = function() {
                var options = {
                  statusText: xhr.statusText,
                  headers: parseHeaders(xhr.getAllResponseHeaders() || "")
                };
                if (request.url.indexOf("file://") === 0 && (xhr.status < 200 || xhr.status > 599)) {
                  options.status = 200;
                } else {
                  options.status = xhr.status;
                }
                options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
                var body = "response" in xhr ? xhr.response : xhr.responseText;
                setTimeout(function() {
                  resolve(new Response(body, options));
                }, 0);
              };
              xhr.onerror = function() {
                setTimeout(function() {
                  reject(new TypeError("Network request failed"));
                }, 0);
              };
              xhr.ontimeout = function() {
                setTimeout(function() {
                  reject(new TypeError("Network request timed out"));
                }, 0);
              };
              xhr.onabort = function() {
                setTimeout(function() {
                  reject(new exports2.DOMException("Aborted", "AbortError"));
                }, 0);
              };
              function fixUrl(url) {
                try {
                  return url === "" && g2.location.href ? g2.location.href : url;
                } catch (e2) {
                  return url;
                }
              }
              xhr.open(request.method, fixUrl(request.url), true);
              if (request.credentials === "include") {
                xhr.withCredentials = true;
              } else if (request.credentials === "omit") {
                xhr.withCredentials = false;
              }
              if ("responseType" in xhr) {
                if (support.blob) {
                  xhr.responseType = "blob";
                } else if (support.arrayBuffer) {
                  xhr.responseType = "arraybuffer";
                }
              }
              if (init && typeof init.headers === "object" && !(init.headers instanceof Headers2 || g2.Headers && init.headers instanceof g2.Headers)) {
                var names = [];
                Object.getOwnPropertyNames(init.headers).forEach(function(name) {
                  names.push(normalizeName(name));
                  xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
                });
                request.headers.forEach(function(value, name) {
                  if (names.indexOf(name) === -1) {
                    xhr.setRequestHeader(name, value);
                  }
                });
              } else {
                request.headers.forEach(function(value, name) {
                  xhr.setRequestHeader(name, value);
                });
              }
              if (request.signal) {
                request.signal.addEventListener("abort", abortXhr);
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    request.signal.removeEventListener("abort", abortXhr);
                  }
                };
              }
              xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
            });
          }
          fetch.polyfill = true;
          if (!g2.fetch) {
            g2.fetch = fetch;
            g2.Headers = Headers2;
            g2.Request = Request;
            g2.Response = Response;
          }
          exports2.Headers = Headers2;
          exports2.Request = Request;
          exports2.Response = Response;
          exports2.fetch = fetch;
          return exports2;
        })({});
      })(typeof self !== "undefined" ? self : exports);
    }
  });

  // ../../node_modules/.pnpm/url-polyfill@1.1.14/node_modules/url-polyfill/url-polyfill.js
  var require_url_polyfill = __commonJS({
    "../../node_modules/.pnpm/url-polyfill@1.1.14/node_modules/url-polyfill/url-polyfill.js"(exports) {
      (function(global2) {
        var checkIfIteratorIsSupported = function() {
          try {
            return !!Symbol.iterator;
          } catch (error) {
            return false;
          }
        };
        var iteratorSupported = checkIfIteratorIsSupported();
        var createIterator = function(items) {
          var iterator = {
            next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            }
          };
          if (iteratorSupported) {
            iterator[Symbol.iterator] = function() {
              return iterator;
            };
          }
          return iterator;
        };
        var serializeParam = function(value) {
          return encodeURIComponent(value).replace(/%20/g, "+");
        };
        var deserializeParam = function(value) {
          return decodeURIComponent(String(value).replace(/\+/g, " "));
        };
        var polyfillURLSearchParams = function() {
          var URLSearchParams2 = function(searchString) {
            Object.defineProperty(this, "_entries", { writable: true, value: {} });
            var typeofSearchString = typeof searchString;
            if (typeofSearchString === "undefined") {
            } else if (typeofSearchString === "string") {
              if (searchString !== "") {
                this._fromString(searchString);
              }
            } else if (searchString instanceof URLSearchParams2) {
              var _this = this;
              searchString.forEach(function(value, name) {
                _this.append(name, value);
              });
            } else if (searchString !== null && typeofSearchString === "object") {
              if (Object.prototype.toString.call(searchString) === "[object Array]") {
                for (var i2 = 0; i2 < searchString.length; i2++) {
                  var entry = searchString[i2];
                  if (Object.prototype.toString.call(entry) === "[object Array]" || entry.length !== 2) {
                    this.append(entry[0], entry[1]);
                  } else {
                    throw new TypeError("Expected [string, any] as entry at index " + i2 + " of URLSearchParams's input");
                  }
                }
              } else {
                for (var key in searchString) {
                  if (searchString.hasOwnProperty(key)) {
                    this.append(key, searchString[key]);
                  }
                }
              }
            } else {
              throw new TypeError("Unsupported input's type for URLSearchParams");
            }
          };
          var proto2 = URLSearchParams2.prototype;
          proto2.append = function(name, value) {
            if (name in this._entries) {
              this._entries[name].push(String(value));
            } else {
              this._entries[name] = [String(value)];
            }
          };
          proto2.delete = function(name) {
            delete this._entries[name];
          };
          proto2.get = function(name) {
            return name in this._entries ? this._entries[name][0] : null;
          };
          proto2.getAll = function(name) {
            return name in this._entries ? this._entries[name].slice(0) : [];
          };
          proto2.has = function(name) {
            return name in this._entries;
          };
          proto2.set = function(name, value) {
            this._entries[name] = [String(value)];
          };
          proto2.forEach = function(callback, thisArg) {
            var entries;
            for (var name in this._entries) {
              if (this._entries.hasOwnProperty(name)) {
                entries = this._entries[name];
                for (var i2 = 0; i2 < entries.length; i2++) {
                  callback.call(thisArg, entries[i2], name, this);
                }
              }
            }
          };
          proto2.keys = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push(name);
            });
            return createIterator(items);
          };
          proto2.values = function() {
            var items = [];
            this.forEach(function(value) {
              items.push(value);
            });
            return createIterator(items);
          };
          proto2.entries = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push([name, value]);
            });
            return createIterator(items);
          };
          if (iteratorSupported) {
            proto2[Symbol.iterator] = proto2.entries;
          }
          proto2.toString = function() {
            var searchArray = [];
            this.forEach(function(value, name) {
              searchArray.push(serializeParam(name) + "=" + serializeParam(value));
            });
            return searchArray.join("&");
          };
          Object.defineProperty(proto2, "size", {
            get: function() {
              return this._entries ? Object.keys(this._entries).length : 0;
            }
          });
          global2.URLSearchParams = URLSearchParams2;
        };
        var checkIfURLSearchParamsSupported = function() {
          try {
            var URLSearchParams2 = global2.URLSearchParams;
            return new URLSearchParams2("?a=1").toString() === "a=1" && typeof URLSearchParams2.prototype.set === "function" && typeof URLSearchParams2.prototype.entries === "function";
          } catch (e2) {
            return false;
          }
        };
        if (!checkIfURLSearchParamsSupported()) {
          polyfillURLSearchParams();
        }
        var proto = global2.URLSearchParams.prototype;
        if (typeof proto.sort !== "function") {
          proto.sort = function() {
            var _this = this;
            var items = [];
            this.forEach(function(value, name) {
              items.push([name, value]);
              if (!_this._entries) {
                _this.delete(name);
              }
            });
            items.sort(function(a2, b2) {
              if (a2[0] < b2[0]) {
                return -1;
              } else if (a2[0] > b2[0]) {
                return 1;
              } else {
                return 0;
              }
            });
            if (_this._entries) {
              _this._entries = {};
            }
            for (var i2 = 0; i2 < items.length; i2++) {
              this.append(items[i2][0], items[i2][1]);
            }
          };
        }
        if (typeof proto._fromString !== "function") {
          Object.defineProperty(proto, "_fromString", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(searchString) {
              if (this._entries) {
                this._entries = {};
              } else {
                var keys = [];
                this.forEach(function(value, name) {
                  keys.push(name);
                });
                for (var i2 = 0; i2 < keys.length; i2++) {
                  this.delete(keys[i2]);
                }
              }
              searchString = searchString.replace(/^\?/, "");
              var attributes = searchString.split("&");
              var attribute;
              for (var i2 = 0; i2 < attributes.length; i2++) {
                attribute = attributes[i2].split("=");
                this.append(
                  deserializeParam(attribute[0]),
                  attribute.length > 1 ? deserializeParam(attribute.slice(1).join("=")) : ""
                );
              }
            }
          });
        }
      })(
        typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : exports
      );
      (function(global2) {
        var checkIfURLIsSupported = function() {
          try {
            var u2 = new global2.URL("b", "http://a");
            u2.pathname = "c d";
            return u2.href === "http://a/c%20d" && u2.searchParams;
          } catch (e2) {
            return false;
          }
        };
        var polyfillURL = function() {
          var _URL = global2.URL;
          var URL2 = function(url, base) {
            if (typeof url !== "string") url = String(url);
            if (base && typeof base !== "string") base = String(base);
            var doc = document, baseElement;
            if (base && (global2.location === void 0 || base !== global2.location.href)) {
              var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
              if (isIE11) {
                base = base.toLowerCase();
              }
              doc = document.implementation.createHTMLDocument("");
              baseElement = doc.createElement("base");
              baseElement.href = base;
              doc.head.appendChild(baseElement);
              try {
                if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
              } catch (err) {
                throw new Error("URL unable to set base " + base + " due to " + err);
              }
            }
            var anchorElement = doc.createElement("a");
            anchorElement.href = url;
            if (baseElement) {
              doc.body.appendChild(anchorElement);
              anchorElement.href = anchorElement.href;
            }
            var inputElement = doc.createElement("input");
            inputElement.type = "url";
            inputElement.value = url;
            if (anchorElement.protocol === ":" || !/:/.test(anchorElement.href) || !inputElement.checkValidity() && !base) {
              throw new TypeError("Invalid URL");
            }
            Object.defineProperty(this, "_anchorElement", {
              value: anchorElement
            });
            var searchParams = new global2.URLSearchParams(this.search);
            var enableSearchUpdate = true;
            var enableSearchParamsUpdate = true;
            var _this = this;
            ["append", "delete", "set"].forEach(function(methodName) {
              var method = searchParams[methodName];
              searchParams[methodName] = function() {
                method.apply(searchParams, arguments);
                if (enableSearchUpdate) {
                  enableSearchParamsUpdate = false;
                  _this.search = searchParams.toString();
                  enableSearchParamsUpdate = true;
                }
              };
            });
            Object.defineProperty(this, "searchParams", {
              value: searchParams,
              enumerable: true
            });
            var search = void 0;
            Object.defineProperty(this, "_updateSearchParams", {
              enumerable: false,
              configurable: false,
              writable: false,
              value: function() {
                if (this.search !== search) {
                  search = this.search;
                  if (enableSearchParamsUpdate) {
                    enableSearchUpdate = false;
                    this.searchParams._fromString(this.search);
                    enableSearchUpdate = true;
                  }
                }
              }
            });
          };
          var proto = URL2.prototype;
          var linkURLWithAnchorAttribute = function(attributeName) {
            Object.defineProperty(proto, attributeName, {
              get: function() {
                return this._anchorElement[attributeName];
              },
              set: function(value) {
                this._anchorElement[attributeName] = value;
              },
              enumerable: true
            });
          };
          ["hash", "host", "hostname", "port", "protocol"].forEach(function(attributeName) {
            linkURLWithAnchorAttribute(attributeName);
          });
          Object.defineProperty(proto, "search", {
            get: function() {
              return this._anchorElement["search"];
            },
            set: function(value) {
              this._anchorElement["search"] = value;
              this._updateSearchParams();
            },
            enumerable: true
          });
          Object.defineProperties(proto, {
            "toString": {
              get: function() {
                var _this = this;
                return function() {
                  return _this.href;
                };
              }
            },
            "href": {
              get: function() {
                return this._anchorElement.href.replace(/\?$/, "");
              },
              set: function(value) {
                this._anchorElement.href = value;
                this._updateSearchParams();
              },
              enumerable: true
            },
            "pathname": {
              get: function() {
                return this._anchorElement.pathname.replace(/(^\/?)/, "/");
              },
              set: function(value) {
                this._anchorElement.pathname = value;
              },
              enumerable: true
            },
            "origin": {
              get: function() {
                var expectedPort = { "http:": 80, "https:": 443, "ftp:": 21 }[this._anchorElement.protocol];
                var addPortToOrigin = this._anchorElement.port != expectedPort && this._anchorElement.port !== "";
                return this._anchorElement.protocol + "//" + this._anchorElement.hostname + (addPortToOrigin ? ":" + this._anchorElement.port : "");
              },
              enumerable: true
            },
            "password": {
              // TODO
              get: function() {
                return "";
              },
              set: function(value) {
              },
              enumerable: true
            },
            "username": {
              // TODO
              get: function() {
                return "";
              },
              set: function(value) {
              },
              enumerable: true
            }
          });
          URL2.createObjectURL = function(blob) {
            return _URL.createObjectURL.apply(_URL, arguments);
          };
          URL2.revokeObjectURL = function(url) {
            return _URL.revokeObjectURL.apply(_URL, arguments);
          };
          global2.URL = URL2;
        };
        if (!checkIfURLIsSupported()) {
          polyfillURL();
        }
        if (global2.location !== void 0 && !("origin" in global2.location)) {
          var getOrigin = function() {
            return global2.location.protocol + "//" + global2.location.hostname + (global2.location.port ? ":" + global2.location.port : "");
          };
          try {
            Object.defineProperty(global2.location, "origin", {
              get: getOrigin,
              enumerable: true
            });
          } catch (e2) {
            setInterval(function() {
              global2.location.origin = getOrigin();
            }, 100);
          }
        }
      })(
        typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : exports
      );
    }
  });

  // ../../node_modules/.pnpm/ws@8.21.0/node_modules/ws/browser.js
  var require_browser = __commonJS({
    "../../node_modules/.pnpm/ws@8.21.0/node_modules/ws/browser.js"(exports, module) {
      "use strict";
      module.exports = function() {
        throw new Error(
          "ws does not work in the browser. Browser clients must use the native WebSocket object"
        );
      };
    }
  });

  // ../../node_modules/.pnpm/@iro+wechat-adapter@1.2.6/node_modules/@iro/wechat-adapter/dist/wechat-adapter.es.js
  var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  function e(t4) {
    return t4 && t4.__esModule && Object.prototype.hasOwnProperty.call(t4, "default") ? t4.default : t4;
  }
  var r = { exports: {} };
  var n = { exports: {} };
  var o = function(t4) {
    return t4 && t4.Math === Math && t4;
  };
  var i = o("object" == typeof globalThis && globalThis) || o("object" == typeof window && window) || o("object" == typeof self && self) || o("object" == typeof t && t) || o("object" == typeof t && t) || /* @__PURE__ */ (function() {
    return this;
  })() || Function("return this")();
  var a = function(t4) {
    try {
      return !!t4();
    } catch (t5) {
      return true;
    }
  };
  var u = !a((function() {
    var t4 = function() {
    }.bind();
    return "function" != typeof t4 || t4.hasOwnProperty("prototype");
  }));
  var c = u;
  var s = Function.prototype;
  var f = s.apply;
  var l = s.call;
  var p = "object" == typeof Reflect && Reflect.apply || (c ? l.bind(f) : function() {
    return l.apply(f, arguments);
  });
  var h = u;
  var v = Function.prototype;
  var d = v.call;
  var y = h && v.bind.bind(d, d);
  var g = h ? y : function(t4) {
    return function() {
      return d.apply(t4, arguments);
    };
  };
  var m = g;
  var b = m({}.toString);
  var w = m("".slice);
  var O = function(t4) {
    return w(b(t4), 8, -1);
  };
  var E = O;
  var S = g;
  var T = function(t4) {
    if ("Function" === E(t4)) return S(t4);
  };
  var j = "object" == typeof document && document.all;
  var x = void 0 === j && void 0 !== j ? function(t4) {
    return "function" == typeof t4 || t4 === j;
  } : function(t4) {
    return "function" == typeof t4;
  };
  var P = {};
  var A = !a((function() {
    return 7 !== Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1];
  }));
  var G = u;
  var L = Function.prototype.call;
  var k = G ? L.bind(L) : function() {
    return L.apply(L, arguments);
  };
  var C = {};
  var R = {}.propertyIsEnumerable;
  var I = Object.getOwnPropertyDescriptor;
  var N = I && !R.call({ 1: 2 }, 1);
  C.f = N ? function(t4) {
    var e2 = I(this, t4);
    return !!e2 && e2.enumerable;
  } : R;
  var M;
  var D;
  var _ = function(t4, e2) {
    return { enumerable: !(1 & t4), configurable: !(2 & t4), writable: !(4 & t4), value: e2 };
  };
  var F = a;
  var z = O;
  var H = Object;
  var W = g("".split);
  var U = F((function() {
    return !H("z").propertyIsEnumerable(0);
  })) ? function(t4) {
    return "String" === z(t4) ? W(t4, "") : H(t4);
  } : H;
  var V = function(t4) {
    return null == t4;
  };
  var B = V;
  var X = TypeError;
  var q = function(t4) {
    if (B(t4)) throw new X("Can't call method on " + t4);
    return t4;
  };
  var K = U;
  var Y = q;
  var J = function(t4) {
    return K(Y(t4));
  };
  var Q = x;
  var Z = function(t4) {
    return "object" == typeof t4 ? null !== t4 : Q(t4);
  };
  var $ = {};
  var tt = $;
  var et = i;
  var rt = x;
  var nt = function(t4) {
    return rt(t4) ? t4 : void 0;
  };
  var ot = function(t4, e2) {
    return arguments.length < 2 ? nt(tt[t4]) || nt(et[t4]) : tt[t4] && tt[t4][e2] || et[t4] && et[t4][e2];
  };
  var it = g({}.isPrototypeOf);
  var at = "undefined" != typeof navigator && String(navigator.userAgent) || "";
  var ut = i;
  var ct = at;
  var st = ut.process;
  var ft = ut.Deno;
  var lt = st && st.versions || ft && ft.version;
  var pt = lt && lt.v8;
  pt && (D = (M = pt.split("."))[0] > 0 && M[0] < 4 ? 1 : +(M[0] + M[1])), !D && ct && (!(M = ct.match(/Edge\/(\d+)/)) || M[1] >= 74) && (M = ct.match(/Chrome\/(\d+)/)) && (D = +M[1]);
  var ht = D;
  var vt = ht;
  var dt = a;
  var yt = i.String;
  var gt = !!Object.getOwnPropertySymbols && !dt((function() {
    var t4 = /* @__PURE__ */ Symbol("symbol detection");
    return !yt(t4) || !(Object(t4) instanceof Symbol) || !Symbol.sham && vt && vt < 41;
  }));
  var mt = gt && !Symbol.sham && "symbol" == typeof Symbol.iterator;
  var bt = ot;
  var wt = x;
  var Ot = it;
  var Et = Object;
  var St = mt ? function(t4) {
    return "symbol" == typeof t4;
  } : function(t4) {
    var e2 = bt("Symbol");
    return wt(e2) && Ot(e2.prototype, Et(t4));
  };
  var Tt = String;
  var jt = function(t4) {
    try {
      return Tt(t4);
    } catch (t5) {
      return "Object";
    }
  };
  var xt = x;
  var Pt = jt;
  var At = TypeError;
  var Gt = function(t4) {
    if (xt(t4)) return t4;
    throw new At(Pt(t4) + " is not a function");
  };
  var Lt = Gt;
  var kt = V;
  var Ct = function(t4, e2) {
    var r2 = t4[e2];
    return kt(r2) ? void 0 : Lt(r2);
  };
  var Rt = k;
  var It = x;
  var Nt = Z;
  var Mt = TypeError;
  var Dt = { exports: {} };
  var _t = i;
  var Ft = Object.defineProperty;
  var zt = i;
  var Ht = function(t4, e2) {
    try {
      Ft(_t, t4, { value: e2, configurable: true, writable: true });
    } catch (r2) {
      _t[t4] = e2;
    }
    return e2;
  };
  var Wt = "__core-js_shared__";
  var Ut = Dt.exports = zt[Wt] || Ht(Wt, {});
  (Ut.versions || (Ut.versions = [])).push({ version: "3.36.1", mode: "pure", copyright: "\xA9 2014-2024 Denis Pushkarev (zloirock.ru)", license: "https://github.com/zloirock/core-js/blob/v3.36.1/LICENSE", source: "https://github.com/zloirock/core-js" });
  var Vt = Dt.exports;
  var Bt = function(t4, e2) {
    return Vt[t4] || (Vt[t4] = e2 || {});
  };
  var Xt = q;
  var qt = Object;
  var Kt = function(t4) {
    return qt(Xt(t4));
  };
  var Yt = Kt;
  var Jt = g({}.hasOwnProperty);
  var Qt = Object.hasOwn || function(t4, e2) {
    return Jt(Yt(t4), e2);
  };
  var Zt = g;
  var $t = 0;
  var te = Math.random();
  var ee = Zt(1 .toString);
  var re = function(t4) {
    return "Symbol(" + (void 0 === t4 ? "" : t4) + ")_" + ee(++$t + te, 36);
  };
  var ne = Bt;
  var oe = Qt;
  var ie = re;
  var ae = gt;
  var ue = mt;
  var ce = i.Symbol;
  var se = ne("wks");
  var fe = ue ? ce.for || ce : ce && ce.withoutSetter || ie;
  var le = function(t4) {
    return oe(se, t4) || (se[t4] = ae && oe(ce, t4) ? ce[t4] : fe("Symbol." + t4)), se[t4];
  };
  var pe = k;
  var he = Z;
  var ve = St;
  var de = Ct;
  var ye = function(t4, e2) {
    var r2, n2;
    if ("string" === e2 && It(r2 = t4.toString) && !Nt(n2 = Rt(r2, t4))) return n2;
    if (It(r2 = t4.valueOf) && !Nt(n2 = Rt(r2, t4))) return n2;
    if ("string" !== e2 && It(r2 = t4.toString) && !Nt(n2 = Rt(r2, t4))) return n2;
    throw new Mt("Can't convert object to primitive value");
  };
  var ge = TypeError;
  var me = le("toPrimitive");
  var be = function(t4, e2) {
    if (!he(t4) || ve(t4)) return t4;
    var r2, n2 = de(t4, me);
    if (n2) {
      if (void 0 === e2 && (e2 = "default"), r2 = pe(n2, t4, e2), !he(r2) || ve(r2)) return r2;
      throw new ge("Can't convert object to primitive value");
    }
    return void 0 === e2 && (e2 = "number"), ye(t4, e2);
  };
  var we = St;
  var Oe = function(t4) {
    var e2 = be(t4, "string");
    return we(e2) ? e2 : e2 + "";
  };
  var Ee = Z;
  var Se = i.document;
  var Te = Ee(Se) && Ee(Se.createElement);
  var je = function(t4) {
    return Te ? Se.createElement(t4) : {};
  };
  var xe = je;
  var Pe = !A && !a((function() {
    return 7 !== Object.defineProperty(xe("div"), "a", { get: function() {
      return 7;
    } }).a;
  }));
  var Ae = A;
  var Ge = k;
  var Le = C;
  var ke = _;
  var Ce = J;
  var Re = Oe;
  var Ie = Qt;
  var Ne = Pe;
  var Me = Object.getOwnPropertyDescriptor;
  P.f = Ae ? Me : function(t4, e2) {
    if (t4 = Ce(t4), e2 = Re(e2), Ne) try {
      return Me(t4, e2);
    } catch (t5) {
    }
    if (Ie(t4, e2)) return ke(!Ge(Le.f, t4, e2), t4[e2]);
  };
  var De = a;
  var _e = x;
  var Fe = /#|\.prototype\./;
  var ze = function(t4, e2) {
    var r2 = We[He(t4)];
    return r2 === Ve || r2 !== Ue && (_e(e2) ? De(e2) : !!e2);
  };
  var He = ze.normalize = function(t4) {
    return String(t4).replace(Fe, ".").toLowerCase();
  };
  var We = ze.data = {};
  var Ue = ze.NATIVE = "N";
  var Ve = ze.POLYFILL = "P";
  var Be = ze;
  var Xe = Gt;
  var qe = u;
  var Ke = T(T.bind);
  var Ye = function(t4, e2) {
    return Xe(t4), void 0 === e2 ? t4 : qe ? Ke(t4, e2) : function() {
      return t4.apply(e2, arguments);
    };
  };
  var Je = {};
  var Qe = A && a((function() {
    return 42 !== Object.defineProperty((function() {
    }), "prototype", { value: 42, writable: false }).prototype;
  }));
  var Ze = Z;
  var $e = String;
  var tr = TypeError;
  var er = function(t4) {
    if (Ze(t4)) return t4;
    throw new tr($e(t4) + " is not an object");
  };
  var rr = A;
  var nr = Pe;
  var or = Qe;
  var ir = er;
  var ar = Oe;
  var ur = TypeError;
  var cr = Object.defineProperty;
  var sr = Object.getOwnPropertyDescriptor;
  var fr = "enumerable";
  var lr = "configurable";
  var pr = "writable";
  Je.f = rr ? or ? function(t4, e2, r2) {
    if (ir(t4), e2 = ar(e2), ir(r2), "function" == typeof t4 && "prototype" === e2 && "value" in r2 && pr in r2 && !r2[pr]) {
      var n2 = sr(t4, e2);
      n2 && n2[pr] && (t4[e2] = r2.value, r2 = { configurable: lr in r2 ? r2[lr] : n2[lr], enumerable: fr in r2 ? r2[fr] : n2[fr], writable: false });
    }
    return cr(t4, e2, r2);
  } : cr : function(t4, e2, r2) {
    if (ir(t4), e2 = ar(e2), ir(r2), nr) try {
      return cr(t4, e2, r2);
    } catch (t5) {
    }
    if ("get" in r2 || "set" in r2) throw new ur("Accessors not supported");
    return "value" in r2 && (t4[e2] = r2.value), t4;
  };
  var hr = Je;
  var vr = _;
  var dr = A ? function(t4, e2, r2) {
    return hr.f(t4, e2, vr(1, r2));
  } : function(t4, e2, r2) {
    return t4[e2] = r2, t4;
  };
  var yr = i;
  var gr = p;
  var mr = T;
  var br = x;
  var wr = P.f;
  var Or = Be;
  var Er = $;
  var Sr = Ye;
  var Tr = dr;
  var jr = Qt;
  var xr = function(t4) {
    var e2 = function(r2, n2, o2) {
      if (this instanceof e2) {
        switch (arguments.length) {
          case 0:
            return new t4();
          case 1:
            return new t4(r2);
          case 2:
            return new t4(r2, n2);
        }
        return new t4(r2, n2, o2);
      }
      return gr(t4, this, arguments);
    };
    return e2.prototype = t4.prototype, e2;
  };
  var Pr = function(t4, e2) {
    var r2, n2, o2, i2, a2, u2, c2, s2, f2, l2 = t4.target, p2 = t4.global, h2 = t4.stat, v2 = t4.proto, d2 = p2 ? yr : h2 ? yr[l2] : yr[l2] && yr[l2].prototype, y2 = p2 ? Er : Er[l2] || Tr(Er, l2, {})[l2], g2 = y2.prototype;
    for (i2 in e2) n2 = !(r2 = Or(p2 ? i2 : l2 + (h2 ? "." : "#") + i2, t4.forced)) && d2 && jr(d2, i2), u2 = y2[i2], n2 && (c2 = t4.dontCallGetSet ? (f2 = wr(d2, i2)) && f2.value : d2[i2]), a2 = n2 && c2 ? c2 : e2[i2], (r2 || v2 || typeof u2 != typeof a2) && (s2 = t4.bind && n2 ? Sr(a2, yr) : t4.wrap && n2 ? xr(a2) : v2 && br(a2) ? mr(a2) : a2, (t4.sham || a2 && a2.sham || u2 && u2.sham) && Tr(s2, "sham", true), Tr(y2, i2, s2), v2 && (jr(Er, o2 = l2 + "Prototype") || Tr(Er, o2, {}), Tr(Er[o2], i2, a2), t4.real && g2 && (r2 || !g2[i2]) && Tr(g2, i2, a2)));
  };
  var Ar = Pr;
  var Gr = a;
  var Lr = J;
  var kr = P.f;
  var Cr = A;
  Ar({ target: "Object", stat: true, forced: !Cr || Gr((function() {
    kr(1);
  })), sham: !Cr }, { getOwnPropertyDescriptor: function(t4, e2) {
    return kr(Lr(t4), e2);
  } });
  var Rr = $.Object;
  var Ir = n.exports = function(t4, e2) {
    return Rr.getOwnPropertyDescriptor(t4, e2);
  };
  Rr.getOwnPropertyDescriptor.sham && (Ir.sham = true);
  var Nr = n.exports;
  var Mr = e(r.exports = Nr);
  function Dr() {
  }
  function _r() {
    return wx.createImage();
  }
  var Fr = wx.createImage();
  function zr() {
    var t4 = wx.createCanvas();
    return t4.style = { cursor: null }, t4;
  }
  var Hr = new zr();
  var Wr = { exports: {} };
  var Ur = Math.ceil;
  var Vr = Math.floor;
  var Br = Math.trunc || function(t4) {
    var e2 = +t4;
    return (e2 > 0 ? Vr : Ur)(e2);
  };
  var Xr = function(t4) {
    var e2 = +t4;
    return e2 != e2 || 0 === e2 ? 0 : Br(e2);
  };
  var qr = Xr;
  var Kr = Math.max;
  var Yr = Math.min;
  var Jr = function(t4, e2) {
    var r2 = qr(t4);
    return r2 < 0 ? Kr(r2 + e2, 0) : Yr(r2, e2);
  };
  var Qr = Xr;
  var Zr = Math.min;
  var $r = function(t4) {
    var e2 = Qr(t4);
    return e2 > 0 ? Zr(e2, 9007199254740991) : 0;
  };
  var tn = function(t4) {
    return $r(t4.length);
  };
  var en = J;
  var rn = Jr;
  var nn = tn;
  var on = function(t4) {
    return function(e2, r2, n2) {
      var o2 = en(e2), i2 = nn(o2);
      if (0 === i2) return !t4 && -1;
      var a2, u2 = rn(n2, i2);
      if (t4 && r2 != r2) {
        for (; i2 > u2; ) if ((a2 = o2[u2++]) != a2) return true;
      } else for (; i2 > u2; u2++) if ((t4 || u2 in o2) && o2[u2] === r2) return t4 || u2 || 0;
      return !t4 && -1;
    };
  };
  var an = { includes: on(true), indexOf: on(false) };
  var un = a;
  var cn = Pr;
  var sn = an.indexOf;
  var fn = function(t4, e2) {
    var r2 = [][t4];
    return !!r2 && un((function() {
      r2.call(null, e2 || function() {
        return 1;
      }, 1);
    }));
  };
  var ln = T([].indexOf);
  var pn = !!ln && 1 / ln([1], 1, -0) < 0;
  cn({ target: "Array", proto: true, forced: pn || !fn("indexOf") }, { indexOf: function(t4) {
    var e2 = arguments.length > 1 ? arguments[1] : void 0;
    return pn ? ln(this, t4, e2) || 0 : sn(this, t4, e2);
  } });
  var hn = i;
  var vn = $;
  var dn = function(t4, e2) {
    var r2 = vn[t4 + "Prototype"], n2 = r2 && r2[e2];
    if (n2) return n2;
    var o2 = hn[t4], i2 = o2 && o2.prototype;
    return i2 && i2[e2];
  };
  var yn = dn("Array", "indexOf");
  var gn = it;
  var mn = yn;
  var bn = Array.prototype;
  var wn = e(Wr.exports = function(t4) {
    var e2 = t4.indexOf;
    return t4 === bn || gn(bn, t4) && e2 === bn.indexOf ? mn : e2;
  });
  var On = { exports: {} };
  var En = O;
  var Sn = Array.isArray || function(t4) {
    return "Array" === En(t4);
  };
  var Tn = A;
  var jn = Sn;
  var xn = TypeError;
  var Pn = Object.getOwnPropertyDescriptor;
  var An = Tn && !(function() {
    if (void 0 !== this) return true;
    try {
      Object.defineProperty([], "length", { writable: false }).length = 1;
    } catch (t4) {
      return t4 instanceof TypeError;
    }
  })() ? function(t4, e2) {
    if (jn(t4) && !Pn(t4, "length").writable) throw new xn("Cannot set read only .length");
    return t4.length = e2;
  } : function(t4, e2) {
    return t4.length = e2;
  };
  var Gn = TypeError;
  var Ln = {};
  Ln[le("toStringTag")] = "z";
  var kn = "[object z]" === String(Ln);
  var Cn = kn;
  var Rn = x;
  var In = O;
  var Nn = le("toStringTag");
  var Mn = Object;
  var Dn = "Arguments" === In(/* @__PURE__ */ (function() {
    return arguments;
  })());
  var _n = Cn ? In : function(t4) {
    var e2, r2, n2;
    return void 0 === t4 ? "Undefined" : null === t4 ? "Null" : "string" == typeof (r2 = (function(t5, e3) {
      try {
        return t5[e3];
      } catch (t6) {
      }
    })(e2 = Mn(t4), Nn)) ? r2 : Dn ? In(e2) : "Object" === (n2 = In(e2)) && Rn(e2.callee) ? "Arguments" : n2;
  };
  var Fn = g;
  var zn = x;
  var Hn = Dt.exports;
  var Wn = Fn(Function.toString);
  zn(Hn.inspectSource) || (Hn.inspectSource = function(t4) {
    return Wn(t4);
  });
  var Un = Hn.inspectSource;
  var Vn = g;
  var Bn = a;
  var Xn = x;
  var qn = _n;
  var Kn = Un;
  var Yn = function() {
  };
  var Jn = ot("Reflect", "construct");
  var Qn = /^\s*(?:class|function)\b/;
  var Zn = Vn(Qn.exec);
  var $n = !Qn.test(Yn);
  var to = function(t4) {
    if (!Xn(t4)) return false;
    try {
      return Jn(Yn, [], t4), true;
    } catch (t5) {
      return false;
    }
  };
  var eo = function(t4) {
    if (!Xn(t4)) return false;
    switch (qn(t4)) {
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return false;
    }
    try {
      return $n || !!Zn(Qn, Kn(t4));
    } catch (t5) {
      return true;
    }
  };
  eo.sham = true;
  var ro = !Jn || Bn((function() {
    var t4;
    return to(to.call) || !to(Object) || !to((function() {
      t4 = true;
    })) || t4;
  })) ? eo : to;
  var no = Sn;
  var oo = ro;
  var io = Z;
  var ao = le("species");
  var uo = Array;
  var co = function(t4) {
    var e2;
    return no(t4) && (e2 = t4.constructor, (oo(e2) && (e2 === uo || no(e2.prototype)) || io(e2) && null === (e2 = e2[ao])) && (e2 = void 0)), void 0 === e2 ? uo : e2;
  };
  var so = function(t4, e2) {
    return new (co(t4))(0 === e2 ? 0 : e2);
  };
  var fo = A;
  var lo = Je;
  var po = _;
  var ho = jt;
  var vo = TypeError;
  var yo = a;
  var go = ht;
  var mo = le("species");
  var bo = function(t4) {
    return go >= 51 || !yo((function() {
      var e2 = [];
      return (e2.constructor = {})[mo] = function() {
        return { foo: 1 };
      }, 1 !== e2[t4](Boolean).foo;
    }));
  };
  var wo = Pr;
  var Oo = Kt;
  var Eo = Jr;
  var So = Xr;
  var To = tn;
  var jo = An;
  var xo = function(t4) {
    if (t4 > 9007199254740991) throw Gn("Maximum allowed index exceeded");
    return t4;
  };
  var Po = so;
  var Ao = function(t4, e2, r2) {
    fo ? lo.f(t4, e2, po(0, r2)) : t4[e2] = r2;
  };
  var Go = function(t4, e2) {
    if (!delete t4[e2]) throw new vo("Cannot delete property " + ho(e2) + " of " + ho(t4));
  };
  var Lo = bo("splice");
  var ko = Math.max;
  var Co = Math.min;
  wo({ target: "Array", proto: true, forced: !Lo }, { splice: function(t4, e2) {
    var r2, n2, o2, i2, a2, u2, c2 = Oo(this), s2 = To(c2), f2 = Eo(t4, s2), l2 = arguments.length;
    for (0 === l2 ? r2 = n2 = 0 : 1 === l2 ? (r2 = 0, n2 = s2 - f2) : (r2 = l2 - 2, n2 = Co(ko(So(e2), 0), s2 - f2)), xo(s2 + r2 - n2), o2 = Po(c2, n2), i2 = 0; i2 < n2; i2++) (a2 = f2 + i2) in c2 && Ao(o2, i2, c2[a2]);
    if (o2.length = n2, r2 < n2) {
      for (i2 = f2; i2 < s2 - n2; i2++) u2 = i2 + r2, (a2 = i2 + n2) in c2 ? c2[u2] = c2[a2] : Go(c2, u2);
      for (i2 = s2; i2 > s2 - n2 + r2; i2--) Go(c2, i2 - 1);
    } else if (r2 > n2) for (i2 = s2 - n2; i2 > f2; i2--) u2 = i2 + r2 - 1, (a2 = i2 + n2 - 1) in c2 ? c2[u2] = c2[a2] : Go(c2, u2);
    for (i2 = 0; i2 < r2; i2++) c2[i2 + f2] = arguments[i2 + 2];
    return jo(c2, s2 - n2 + r2), o2;
  } });
  var Ro = dn("Array", "splice");
  var Io = it;
  var No = Ro;
  var Mo = Array.prototype;
  var Do = e(On.exports = function(t4) {
    var e2 = t4.splice;
    return t4 === Mo || Io(Mo, t4) && e2 === Mo.splice ? No : e2;
  });
  function _o(t4, e2, r2) {
    return e2 = Xo(e2), (function(t5, e3) {
      if (e3 && ("object" == typeof e3 || "function" == typeof e3)) return e3;
      if (void 0 !== e3) throw new TypeError("Derived constructors may only return object or undefined");
      return (function(t6) {
        if (void 0 === t6) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t6;
      })(t5);
    })(t4, Fo() ? Reflect.construct(e2, r2 || [], Xo(t4).constructor) : e2.apply(t4, r2));
  }
  function Fo() {
    try {
      var t4 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {
      })));
    } catch (t5) {
    }
    return (Fo = function() {
      return !!t4;
    })();
  }
  function zo(t4) {
    var e2 = (function(t5, e3) {
      if ("object" != typeof t5 || !t5) return t5;
      var r2 = t5[Symbol.toPrimitive];
      if (void 0 !== r2) {
        var n2 = r2.call(t5, e3 || "default");
        if ("object" != typeof n2) return n2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === e3 ? String : Number)(t5);
    })(t4, "string");
    return "symbol" == typeof e2 ? e2 : e2 + "";
  }
  function Ho(t4, e2) {
    if (!(t4 instanceof e2)) throw new TypeError("Cannot call a class as a function");
  }
  function Wo(t4, e2) {
    for (var r2 = 0; r2 < e2.length; r2++) {
      var n2 = e2[r2];
      n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(t4, zo(n2.key), n2);
    }
  }
  function Uo(t4, e2, r2) {
    return e2 && Wo(t4.prototype, e2), r2 && Wo(t4, r2), Object.defineProperty(t4, "prototype", { writable: false }), t4;
  }
  function Vo(t4, e2, r2) {
    return (e2 = zo(e2)) in t4 ? Object.defineProperty(t4, e2, { value: r2, enumerable: true, configurable: true, writable: true }) : t4[e2] = r2, t4;
  }
  function Bo(t4, e2) {
    if ("function" != typeof e2 && null !== e2) throw new TypeError("Super expression must either be null or a function");
    t4.prototype = Object.create(e2 && e2.prototype, { constructor: { value: t4, writable: true, configurable: true } }), Object.defineProperty(t4, "prototype", { writable: false }), e2 && qo(t4, e2);
  }
  function Xo(t4) {
    return Xo = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t5) {
      return t5.__proto__ || Object.getPrototypeOf(t5);
    }, Xo(t4);
  }
  function qo(t4, e2) {
    return qo = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t5, e3) {
      return t5.__proto__ = e3, t5;
    }, qo(t4, e2);
  }
  var Ko = (function() {
    return Uo((function t4() {
      Ho(this, t4), Vo(this, "style", { cursor: null }), Vo(this, "pathname", "");
    }), [{ key: "appendChild", value: function() {
    } }, { key: "removeChild", value: function() {
    } }, { key: "addEventListener", value: function() {
    } }, { key: "removeEventListener", value: function() {
    } }, { key: "setAttribute", value: function() {
    } }]);
  })();
  var Yo = Hr.constructor;
  var Jo = (function(t4) {
    function e2() {
      return Ho(this, e2), _o(this, e2, arguments);
    }
    return Bo(e2, Fr.constructor), Uo(e2);
  })();
  var Qo = (function(t4) {
    function e2() {
      return Ho(this, e2), _o(this, e2, arguments);
    }
    return Bo(e2, Ko), Uo(e2);
  })();
  function Zo() {
    var t4 = wx.createVideo({ width: 0, height: 0, controls: false });
    return t4.canPlayType = function() {
      return true;
    }, t4;
  }
  var $o;
  var ti;
  var ei;
  var ri = {};
  var ni = { body: new Ko("body"), cookie: "", addEventListener: function(t4, e2) {
    ri[t4] = ri[t4] || [], ri[t4].push(e2);
  }, removeEventListener: function(t4, e2) {
    if (ri[t4] && ri[t4].length) {
      var r2, n2, o2 = wn(r2 = ri[t4]).call(r2, e2);
      -1 !== o2 && Do(n2 = ri[t4]).call(n2, o2);
    }
  }, dispatch: function(t4) {
    var e2 = ri[t4.type];
    e2 && e2.forEach((function(e3) {
      return e3(t4);
    }));
  }, createElement: function(t4) {
    switch (t4 = t4.toLowerCase()) {
      case "canvas":
        return new zr();
      case "image":
      case "img":
        return new _r();
      case "video":
        return new Zo();
      default:
        return new Ko();
    }
  } };
  var oi = { exports: {} };
  var ii = {};
  var ai = x;
  var ui = i.WeakMap;
  var ci = ai(ui) && /native code/.test(String(ui));
  var si = re;
  var fi = Bt("keys");
  var li = function(t4) {
    return fi[t4] || (fi[t4] = si(t4));
  };
  var pi = {};
  var hi = ci;
  var vi = i;
  var di = Z;
  var yi = dr;
  var gi = Qt;
  var mi = Dt.exports;
  var bi = li;
  var wi = pi;
  var Oi = "Object already initialized";
  var Ei = vi.TypeError;
  var Si = vi.WeakMap;
  if (hi || mi.state) {
    Ti = mi.state || (mi.state = new Si());
    Ti.get = Ti.get, Ti.has = Ti.has, Ti.set = Ti.set, $o = function(t4, e2) {
      if (Ti.has(t4)) throw new Ei(Oi);
      return e2.facade = t4, Ti.set(t4, e2), e2;
    }, ti = function(t4) {
      return Ti.get(t4) || {};
    }, ei = function(t4) {
      return Ti.has(t4);
    };
  } else {
    ji = bi("state");
    wi[ji] = true, $o = function(t4, e2) {
      if (gi(t4, ji)) throw new Ei(Oi);
      return e2.facade = t4, yi(t4, ji, e2), e2;
    }, ti = function(t4) {
      return gi(t4, ji) ? t4[ji] : {};
    }, ei = function(t4) {
      return gi(t4, ji);
    };
  }
  var Ti;
  var ji;
  var xi = { set: $o, get: ti, has: ei, enforce: function(t4) {
    return ei(t4) ? ti(t4) : $o(t4, {});
  }, getterFor: function(t4) {
    return function(e2) {
      var r2;
      if (!di(e2) || (r2 = ti(e2)).type !== t4) throw new Ei("Incompatible receiver, " + t4 + " required");
      return r2;
    };
  } };
  var Pi = A;
  var Ai = Qt;
  var Gi = Function.prototype;
  var Li = Pi && Object.getOwnPropertyDescriptor;
  var ki = Ai(Gi, "name");
  var Ci = { EXISTS: ki, PROPER: ki && "something" === function() {
  }.name, CONFIGURABLE: ki && (!Pi || Pi && Li(Gi, "name").configurable) };
  var Ri = {};
  var Ii = Qt;
  var Ni = J;
  var Mi = an.indexOf;
  var Di = pi;
  var _i = g([].push);
  var Fi = function(t4, e2) {
    var r2, n2 = Ni(t4), o2 = 0, i2 = [];
    for (r2 in n2) !Ii(Di, r2) && Ii(n2, r2) && _i(i2, r2);
    for (; e2.length > o2; ) Ii(n2, r2 = e2[o2++]) && (~Mi(i2, r2) || _i(i2, r2));
    return i2;
  };
  var zi = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
  var Hi = Fi;
  var Wi = zi;
  var Ui = Object.keys || function(t4) {
    return Hi(t4, Wi);
  };
  var Vi = A;
  var Bi = Qe;
  var Xi = Je;
  var qi = er;
  var Ki = J;
  var Yi = Ui;
  Ri.f = Vi && !Bi ? Object.defineProperties : function(t4, e2) {
    qi(t4);
    for (var r2, n2 = Ki(e2), o2 = Yi(e2), i2 = o2.length, a2 = 0; i2 > a2; ) Xi.f(t4, r2 = o2[a2++], n2[r2]);
    return t4;
  };
  var Ji;
  var Qi = ot("document", "documentElement");
  var Zi = er;
  var $i = Ri;
  var ta = zi;
  var ea = pi;
  var ra = Qi;
  var na = je;
  var oa = "prototype";
  var ia = "script";
  var aa = li("IE_PROTO");
  var ua = function() {
  };
  var ca = function(t4) {
    return "<" + ia + ">" + t4 + "</" + ia + ">";
  };
  var sa = function(t4) {
    t4.write(ca("")), t4.close();
    var e2 = t4.parentWindow.Object;
    return t4 = null, e2;
  };
  var fa = function() {
    try {
      Ji = new ActiveXObject("htmlfile");
    } catch (t5) {
    }
    var t4, e2, r2;
    fa = "undefined" != typeof document ? document.domain && Ji ? sa(Ji) : (e2 = na("iframe"), r2 = "java" + ia + ":", e2.style.display = "none", ra.appendChild(e2), e2.src = String(r2), (t4 = e2.contentWindow.document).open(), t4.write(ca("document.F=Object")), t4.close(), t4.F) : sa(Ji);
    for (var n2 = ta.length; n2--; ) delete fa[oa][ta[n2]];
    return fa();
  };
  ea[aa] = true;
  var la;
  var pa;
  var ha;
  var va = Object.create || function(t4, e2) {
    var r2;
    return null !== t4 ? (ua[oa] = Zi(t4), r2 = new ua(), ua[oa] = null, r2[aa] = t4) : r2 = fa(), void 0 === e2 ? r2 : $i.f(r2, e2);
  };
  var da = !a((function() {
    function t4() {
    }
    return t4.prototype.constructor = null, Object.getPrototypeOf(new t4()) !== t4.prototype;
  }));
  var ya = Qt;
  var ga = x;
  var ma = Kt;
  var ba = da;
  var wa = li("IE_PROTO");
  var Oa = Object;
  var Ea = Oa.prototype;
  var Sa = ba ? Oa.getPrototypeOf : function(t4) {
    var e2 = ma(t4);
    if (ya(e2, wa)) return e2[wa];
    var r2 = e2.constructor;
    return ga(r2) && e2 instanceof r2 ? r2.prototype : e2 instanceof Oa ? Ea : null;
  };
  var Ta = dr;
  var ja = function(t4, e2, r2, n2) {
    return n2 && n2.enumerable ? t4[e2] = r2 : Ta(t4, e2, r2), t4;
  };
  var xa = a;
  var Pa = x;
  var Aa = Z;
  var Ga = va;
  var La = Sa;
  var ka = ja;
  var Ca = le("iterator");
  var Ra = false;
  [].keys && ("next" in (ha = [].keys()) ? (pa = La(La(ha))) !== Object.prototype && (la = pa) : Ra = true);
  var Ia = !Aa(la) || xa((function() {
    var t4 = {};
    return la[Ca].call(t4) !== t4;
  }));
  Pa((la = Ia ? {} : Ga(la))[Ca]) || ka(la, Ca, (function() {
    return this;
  }));
  var Na = { IteratorPrototype: la, BUGGY_SAFARI_ITERATORS: Ra };
  var Ma = _n;
  var Da = kn ? {}.toString : function() {
    return "[object " + Ma(this) + "]";
  };
  var _a = kn;
  var Fa = Je.f;
  var za = dr;
  var Ha = Qt;
  var Wa = Da;
  var Ua = le("toStringTag");
  var Va = function(t4, e2, r2, n2) {
    var o2 = r2 ? t4 : t4 && t4.prototype;
    o2 && (Ha(o2, Ua) || Fa(o2, Ua, { configurable: true, value: e2 }), n2 && !_a && za(o2, "toString", Wa));
  };
  var Ba = Na.IteratorPrototype;
  var Xa = va;
  var qa = _;
  var Ka = Va;
  var Ya = ii;
  var Ja = function() {
    return this;
  };
  var Qa = g;
  var Za = Gt;
  var $a = Z;
  var tu = function(t4) {
    return $a(t4) || null === t4;
  };
  var eu = String;
  var ru = TypeError;
  var nu = function(t4, e2, r2) {
    try {
      return Qa(Za(Object.getOwnPropertyDescriptor(t4, e2)[r2]));
    } catch (t5) {
    }
  };
  var ou = Z;
  var iu = q;
  var au = function(t4) {
    if (tu(t4)) return t4;
    throw new ru("Can't set " + eu(t4) + " as a prototype");
  };
  var uu = Object.setPrototypeOf || ("__proto__" in {} ? (function() {
    var t4, e2 = false, r2 = {};
    try {
      (t4 = nu(Object.prototype, "__proto__", "set"))(r2, []), e2 = r2 instanceof Array;
    } catch (t5) {
    }
    return function(r3, n2) {
      return iu(r3), au(n2), ou(r3) ? (e2 ? t4(r3, n2) : r3.__proto__ = n2, r3) : r3;
    };
  })() : void 0);
  var cu = Pr;
  var su = k;
  var fu = Ci;
  var lu = function(t4, e2, r2, n2) {
    var o2 = e2 + " Iterator";
    return t4.prototype = Xa(Ba, { next: qa(+!n2, r2) }), Ka(t4, o2, false, true), Ya[o2] = Ja, t4;
  };
  var pu = Sa;
  var hu = Va;
  var vu = ja;
  var du = ii;
  var yu = Na;
  var gu = fu.PROPER;
  var mu = yu.BUGGY_SAFARI_ITERATORS;
  var bu = le("iterator");
  var wu = "keys";
  var Ou = "values";
  var Eu = "entries";
  var Su = function() {
    return this;
  };
  var Tu = function(t4, e2, r2, n2, o2, i2, a2) {
    lu(r2, e2, n2);
    var u2, c2, s2, f2 = function(t5) {
      if (t5 === o2 && d2) return d2;
      if (!mu && t5 && t5 in h2) return h2[t5];
      switch (t5) {
        case wu:
        case Ou:
        case Eu:
          return function() {
            return new r2(this, t5);
          };
      }
      return function() {
        return new r2(this);
      };
    }, l2 = e2 + " Iterator", p2 = false, h2 = t4.prototype, v2 = h2[bu] || h2["@@iterator"] || o2 && h2[o2], d2 = !mu && v2 || f2(o2), y2 = "Array" === e2 && h2.entries || v2;
    if (y2 && (u2 = pu(y2.call(new t4()))) !== Object.prototype && u2.next && (hu(u2, l2, true, true), du[l2] = Su), gu && o2 === Ou && v2 && v2.name !== Ou && (p2 = true, d2 = function() {
      return su(v2, this);
    }), o2) if (c2 = { values: f2(Ou), keys: i2 ? d2 : f2(wu), entries: f2(Eu) }, a2) for (s2 in c2) (mu || p2 || !(s2 in h2)) && vu(h2, s2, c2[s2]);
    else cu({ target: e2, proto: true, forced: mu || p2 }, c2);
    return a2 && h2[bu] !== d2 && vu(h2, bu, d2, { name: o2 }), du[e2] = d2, c2;
  };
  var ju = function(t4, e2) {
    return { value: t4, done: e2 };
  };
  var xu = J;
  var Pu = function() {
  };
  var Au = ii;
  var Gu = xi;
  var Lu = (Je.f, Tu);
  var ku = ju;
  var Cu = "Array Iterator";
  var Ru = Gu.set;
  var Iu = Gu.getterFor(Cu);
  Lu(Array, "Array", (function(t4, e2) {
    Ru(this, { type: Cu, target: xu(t4), index: 0, kind: e2 });
  }), (function() {
    var t4 = Iu(this), e2 = t4.target, r2 = t4.index++;
    if (!e2 || r2 >= e2.length) return t4.target = void 0, ku(void 0, true);
    switch (t4.kind) {
      case "keys":
        return ku(r2, false);
      case "values":
        return ku(e2[r2], false);
    }
    return ku([r2, e2[r2]], false);
  }), "values");
  Au.Arguments = Au.Array;
  Pu(), Pu(), Pu();
  var Nu = !a((function() {
    return Object.isExtensible(Object.preventExtensions({}));
  }));
  var Mu = ja;
  var Du = function(t4, e2, r2) {
    for (var n2 in e2) r2 && r2.unsafe && t4[n2] ? t4[n2] = e2[n2] : Mu(t4, n2, e2[n2], r2);
    return t4;
  };
  var _u = { exports: {} };
  var Fu = {};
  var zu = Fi;
  var Hu = zi.concat("length", "prototype");
  Fu.f = Object.getOwnPropertyNames || function(t4) {
    return zu(t4, Hu);
  };
  var Wu = {};
  var Uu = g([].slice);
  var Vu = O;
  var Bu = J;
  var Xu = Fu.f;
  var qu = Uu;
  var Ku = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
  Wu.f = function(t4) {
    return Ku && "Window" === Vu(t4) ? (function(t5) {
      try {
        return Xu(t5);
      } catch (t6) {
        return qu(Ku);
      }
    })(t4) : Xu(Bu(t4));
  };
  var Yu = a((function() {
    if ("function" == typeof ArrayBuffer) {
      var t4 = new ArrayBuffer(8);
      Object.isExtensible(t4) && Object.defineProperty(t4, "a", { value: 8 });
    }
  }));
  var Ju = a;
  var Qu = Z;
  var Zu = O;
  var $u = Yu;
  var tc = Object.isExtensible;
  var ec = Ju((function() {
    tc(1);
  })) || $u ? function(t4) {
    return !!Qu(t4) && ((!$u || "ArrayBuffer" !== Zu(t4)) && (!tc || tc(t4)));
  } : tc;
  var rc = Pr;
  var nc = g;
  var oc = pi;
  var ic = Z;
  var ac = Qt;
  var uc = Je.f;
  var cc2 = Fu;
  var sc = Wu;
  var fc = ec;
  var lc = Nu;
  var pc = false;
  var hc = re("meta");
  var vc = 0;
  var dc = function(t4) {
    uc(t4, hc, { value: { objectID: "O" + vc++, weakData: {} } });
  };
  var yc = _u.exports = { enable: function() {
    yc.enable = function() {
    }, pc = true;
    var t4 = cc2.f, e2 = nc([].splice), r2 = {};
    r2[hc] = 1, t4(r2).length && (cc2.f = function(r3) {
      for (var n2 = t4(r3), o2 = 0, i2 = n2.length; o2 < i2; o2++) if (n2[o2] === hc) {
        e2(n2, o2, 1);
        break;
      }
      return n2;
    }, rc({ target: "Object", stat: true, forced: true }, { getOwnPropertyNames: sc.f }));
  }, fastKey: function(t4, e2) {
    if (!ic(t4)) return "symbol" == typeof t4 ? t4 : ("string" == typeof t4 ? "S" : "P") + t4;
    if (!ac(t4, hc)) {
      if (!fc(t4)) return "F";
      if (!e2) return "E";
      dc(t4);
    }
    return t4[hc].objectID;
  }, getWeakData: function(t4, e2) {
    if (!ac(t4, hc)) {
      if (!fc(t4)) return true;
      if (!e2) return false;
      dc(t4);
    }
    return t4[hc].weakData;
  }, onFreeze: function(t4) {
    return lc && pc && fc(t4) && !ac(t4, hc) && dc(t4), t4;
  } };
  oc[hc] = true;
  var gc = ii;
  var mc = le("iterator");
  var bc = Array.prototype;
  var wc = _n;
  var Oc = Ct;
  var Ec = V;
  var Sc = ii;
  var Tc = le("iterator");
  var jc = function(t4) {
    if (!Ec(t4)) return Oc(t4, Tc) || Oc(t4, "@@iterator") || Sc[wc(t4)];
  };
  var xc = k;
  var Pc = Gt;
  var Ac = er;
  var Gc = jt;
  var Lc = jc;
  var kc = TypeError;
  var Cc = k;
  var Rc = er;
  var Ic = Ct;
  var Nc = Ye;
  var Mc = k;
  var Dc = er;
  var _c = jt;
  var Fc = function(t4) {
    return void 0 !== t4 && (gc.Array === t4 || bc[mc] === t4);
  };
  var zc = tn;
  var Hc = it;
  var Wc = function(t4, e2) {
    var r2 = arguments.length < 2 ? Lc(t4) : e2;
    if (Pc(r2)) return Ac(xc(r2, t4));
    throw new kc(Gc(t4) + " is not iterable");
  };
  var Uc = jc;
  var Vc = function(t4, e2, r2) {
    var n2, o2;
    Rc(t4);
    try {
      if (!(n2 = Ic(t4, "return"))) {
        if ("throw" === e2) throw r2;
        return r2;
      }
      n2 = Cc(n2, t4);
    } catch (t5) {
      o2 = true, n2 = t5;
    }
    if ("throw" === e2) throw r2;
    if (o2) throw n2;
    return Rc(n2), r2;
  };
  var Bc = TypeError;
  var Xc = function(t4, e2) {
    this.stopped = t4, this.result = e2;
  };
  var qc = Xc.prototype;
  var Kc = function(t4, e2, r2) {
    var n2, o2, i2, a2, u2, c2, s2, f2 = r2 && r2.that, l2 = !(!r2 || !r2.AS_ENTRIES), p2 = !(!r2 || !r2.IS_RECORD), h2 = !(!r2 || !r2.IS_ITERATOR), v2 = !(!r2 || !r2.INTERRUPTED), d2 = Nc(e2, f2), y2 = function(t5) {
      return n2 && Vc(n2, "normal", t5), new Xc(true, t5);
    }, g2 = function(t5) {
      return l2 ? (Dc(t5), v2 ? d2(t5[0], t5[1], y2) : d2(t5[0], t5[1])) : v2 ? d2(t5, y2) : d2(t5);
    };
    if (p2) n2 = t4.iterator;
    else if (h2) n2 = t4;
    else {
      if (!(o2 = Uc(t4))) throw new Bc(_c(t4) + " is not iterable");
      if (Fc(o2)) {
        for (i2 = 0, a2 = zc(t4); a2 > i2; i2++) if ((u2 = g2(t4[i2])) && Hc(qc, u2)) return u2;
        return new Xc(false);
      }
      n2 = Wc(t4, o2);
    }
    for (c2 = p2 ? t4.next : n2.next; !(s2 = Mc(c2, n2)).done; ) {
      try {
        u2 = g2(s2.value);
      } catch (t5) {
        Vc(n2, "throw", t5);
      }
      if ("object" == typeof u2 && u2 && Hc(qc, u2)) return u2;
    }
    return new Xc(false);
  };
  var Yc = it;
  var Jc = TypeError;
  var Qc = function(t4, e2) {
    if (Yc(e2, t4)) return t4;
    throw new Jc("Incorrect invocation");
  };
  var Zc = Ye;
  var $c = U;
  var ts = Kt;
  var es = tn;
  var rs = so;
  var ns = g([].push);
  var os = function(t4) {
    var e2 = 1 === t4, r2 = 2 === t4, n2 = 3 === t4, o2 = 4 === t4, i2 = 6 === t4, a2 = 7 === t4, u2 = 5 === t4 || i2;
    return function(c2, s2, f2, l2) {
      for (var p2, h2, v2 = ts(c2), d2 = $c(v2), y2 = es(d2), g2 = Zc(s2, f2), m2 = 0, b2 = l2 || rs, w2 = e2 ? b2(c2, y2) : r2 || a2 ? b2(c2, 0) : void 0; y2 > m2; m2++) if ((u2 || m2 in d2) && (h2 = g2(p2 = d2[m2], m2, v2), t4)) if (e2) w2[m2] = h2;
      else if (h2) switch (t4) {
        case 3:
          return true;
        case 5:
          return p2;
        case 6:
          return m2;
        case 2:
          ns(w2, p2);
      }
      else switch (t4) {
        case 4:
          return false;
        case 7:
          ns(w2, p2);
      }
      return i2 ? -1 : n2 || o2 ? o2 : w2;
    };
  };
  var is = { forEach: os(0), map: os(1), filter: os(2), some: os(3), every: os(4), find: os(5), findIndex: os(6), filterReject: os(7) };
  var as = Pr;
  var us = i;
  var cs = _u.exports;
  var ss = a;
  var fs = dr;
  var ls = Kc;
  var ps = Qc;
  var hs = x;
  var vs = Z;
  var ds = V;
  var ys = Va;
  var gs = Je.f;
  var ms = is.forEach;
  var bs = A;
  var ws = xi.set;
  var Os = xi.getterFor;
  var Es = g;
  var Ss = Du;
  var Ts = _u.exports.getWeakData;
  var js = Qc;
  var xs = er;
  var Ps = V;
  var As = Z;
  var Gs = Kc;
  var Ls = Qt;
  var ks = xi.set;
  var Cs = xi.getterFor;
  var Rs = is.find;
  var Is = is.findIndex;
  var Ns = Es([].splice);
  var Ms = 0;
  var Ds = function(t4) {
    return t4.frozen || (t4.frozen = new _s());
  };
  var _s = function() {
    this.entries = [];
  };
  var Fs = function(t4, e2) {
    return Rs(t4.entries, (function(t5) {
      return t5[0] === e2;
    }));
  };
  _s.prototype = { get: function(t4) {
    var e2 = Fs(this, t4);
    if (e2) return e2[1];
  }, has: function(t4) {
    return !!Fs(this, t4);
  }, set: function(t4, e2) {
    var r2 = Fs(this, t4);
    r2 ? r2[1] = e2 : this.entries.push([t4, e2]);
  }, delete: function(t4) {
    var e2 = Is(this.entries, (function(e3) {
      return e3[0] === t4;
    }));
    return ~e2 && Ns(this.entries, e2, 1), !!~e2;
  } };
  var zs;
  var Hs = { getConstructor: function(t4, e2, r2, n2) {
    var o2 = t4((function(t5, o3) {
      js(t5, i2), ks(t5, { type: e2, id: Ms++, frozen: void 0 }), Ps(o3) || Gs(o3, t5[n2], { that: t5, AS_ENTRIES: r2 });
    })), i2 = o2.prototype, a2 = Cs(e2), u2 = function(t5, e3, r3) {
      var n3 = a2(t5), o3 = Ts(xs(e3), true);
      return true === o3 ? Ds(n3).set(e3, r3) : o3[n3.id] = r3, t5;
    };
    return Ss(i2, { delete: function(t5) {
      var e3 = a2(this);
      if (!As(t5)) return false;
      var r3 = Ts(t5);
      return true === r3 ? Ds(e3).delete(t5) : r3 && Ls(r3, e3.id) && delete r3[e3.id];
    }, has: function(t5) {
      var e3 = a2(this);
      if (!As(t5)) return false;
      var r3 = Ts(t5);
      return true === r3 ? Ds(e3).has(t5) : r3 && Ls(r3, e3.id);
    } }), Ss(i2, r2 ? { get: function(t5) {
      var e3 = a2(this);
      if (As(t5)) {
        var r3 = Ts(t5);
        return true === r3 ? Ds(e3).get(t5) : r3 ? r3[e3.id] : void 0;
      }
    }, set: function(t5, e3) {
      return u2(this, t5, e3);
    } } : { add: function(t5) {
      return u2(this, t5, true);
    } }), o2;
  } };
  var Ws = Nu;
  var Us = i;
  var Vs = g;
  var Bs = Du;
  var Xs = _u.exports;
  var qs = function(t4, e2, r2) {
    var n2, o2 = -1 !== t4.indexOf("Map"), i2 = -1 !== t4.indexOf("Weak"), a2 = o2 ? "set" : "add", u2 = us[t4], c2 = u2 && u2.prototype, s2 = {};
    if (bs && hs(u2) && (i2 || c2.forEach && !ss((function() {
      new u2().entries().next();
    })))) {
      var f2 = (n2 = e2((function(e3, r3) {
        ws(ps(e3, f2), { type: t4, collection: new u2() }), ds(r3) || ls(r3, e3[a2], { that: e3, AS_ENTRIES: o2 });
      }))).prototype, l2 = Os(t4);
      ms(["add", "clear", "delete", "forEach", "get", "has", "set", "keys", "values", "entries"], (function(t5) {
        var e3 = "add" === t5 || "set" === t5;
        !(t5 in c2) || i2 && "clear" === t5 || fs(f2, t5, (function(r3, n3) {
          var o3 = l2(this).collection;
          if (!e3 && i2 && !vs(r3)) return "get" === t5 && void 0;
          var a3 = o3[t5](0 === r3 ? 0 : r3, n3);
          return e3 ? this : a3;
        }));
      })), i2 || gs(f2, "size", { configurable: true, get: function() {
        return l2(this).collection.size;
      } });
    } else n2 = r2.getConstructor(e2, t4, o2, a2), cs.enable();
    return ys(n2, t4, false, true), s2[t4] = n2, as({ global: true, forced: true }, s2), i2 || r2.setStrong(n2, t4, o2), n2;
  };
  var Ks = Hs;
  var Ys = Z;
  var Js = xi.enforce;
  var Qs = a;
  var Zs = ci;
  var $s = Object;
  var tf = Array.isArray;
  var ef = $s.isExtensible;
  var rf = $s.isFrozen;
  var nf = $s.isSealed;
  var of = $s.freeze;
  var af = $s.seal;
  var uf = !Us.ActiveXObject && "ActiveXObject" in Us;
  var cf = function(t4) {
    return function() {
      return t4(this, arguments.length ? arguments[0] : void 0);
    };
  };
  var sf = qs("WeakMap", cf, Ks);
  var ff = sf.prototype;
  var lf = Vs(ff.set);
  if (Zs) if (uf) {
    zs = Ks.getConstructor(cf, "WeakMap", true), Xs.enable();
    pf = Vs(ff.delete), hf = Vs(ff.has), vf = Vs(ff.get);
    Bs(ff, { delete: function(t4) {
      if (Ys(t4) && !ef(t4)) {
        var e2 = Js(this);
        return e2.frozen || (e2.frozen = new zs()), pf(this, t4) || e2.frozen.delete(t4);
      }
      return pf(this, t4);
    }, has: function(t4) {
      if (Ys(t4) && !ef(t4)) {
        var e2 = Js(this);
        return e2.frozen || (e2.frozen = new zs()), hf(this, t4) || e2.frozen.has(t4);
      }
      return hf(this, t4);
    }, get: function(t4) {
      if (Ys(t4) && !ef(t4)) {
        var e2 = Js(this);
        return e2.frozen || (e2.frozen = new zs()), hf(this, t4) ? vf(this, t4) : e2.frozen.get(t4);
      }
      return vf(this, t4);
    }, set: function(t4, e2) {
      if (Ys(t4) && !ef(t4)) {
        var r2 = Js(this);
        r2.frozen || (r2.frozen = new zs()), hf(this, t4) ? lf(this, t4, e2) : r2.frozen.set(t4, e2);
      } else lf(this, t4, e2);
      return this;
    } });
  } else Ws && Qs((function() {
    var t4 = of([]);
    return lf(new sf(), t4, 1), !rf(t4);
  })) && Bs(ff, { set: function(t4, e2) {
    var r2;
    return tf(t4) && (rf(t4) ? r2 = of : nf(t4) && (r2 = af)), lf(this, t4, e2), r2 && r2(t4), this;
  } });
  var pf;
  var hf;
  var vf;
  var df = $.WeakMap;
  var yf = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
  var gf = i;
  var mf = Va;
  var bf = ii;
  for (wf in yf) mf(gf[wf], wf), bf[wf] = bf.Array;
  var wf;
  var Of = new (e(oi.exports = df))();
  var Ef = (function() {
    function t4(e2) {
      var r2 = this, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
      if (Ho(this, t4), this.binaryType = "", this.bufferedAmount = 0, this.extensions = "", this.onclose = null, this.onerror = null, this.onmessage = null, this.onopen = null, this.protocol = "", this.readyState = 3, "string" != typeof e2 || !/(^ws:\/\/)|(^wss:\/\/)/.test(e2)) throw new TypeError("Failed to construct 'WebSocket': The URL '".concat(e2, "' is invalid"));
      this.url = e2, this.readyState = t4.CONNECTING;
      var o2 = wx.connectSocket({ url: e2, protocols: Array.isArray(n2) ? n2 : [n2] });
      return Of.set(this, o2), o2.onClose((function(e3) {
        r2.readyState = t4.CLOSED, "function" == typeof r2.onclose && r2.onclose(e3);
      })), o2.onMessage((function(t5) {
        "function" == typeof r2.onmessage && r2.onmessage(t5);
      })), o2.onOpen((function() {
        r2.readyState = t4.OPEN, "function" == typeof r2.onopen && r2.onopen();
      })), o2.onError((function(t5) {
        "function" == typeof r2.onerror && r2.onerror(new Error(t5.errMsg));
      })), this;
    }
    return Uo(t4, [{ key: "close", value: function(e2, r2) {
      this.readyState = t4.CLOSING, Of.get(this).close({ code: e2, reason: r2 });
    } }, { key: "send", value: function(t5) {
      if ("string" != typeof t5 && !(t5 instanceof ArrayBuffer)) throw new TypeError("Failed to send message: The data ".concat(t5, " is invalid"));
      Of.get(this).send({ data: t5 });
    } }]);
  })();
  Vo(Ef, "CONNECTING", 0), Vo(Ef, "OPEN", 1), Vo(Ef, "CLOSING", 2), Vo(Ef, "CLOSED", 3);
  var Sf = Uo((function t2(e2) {
    Ho(this, t2), Vo(this, "preventDefault", Dr), Vo(this, "stopPropagation", Dr), Vo(this, "target", Hr), Vo(this, "currentTarget", Hr), this.type = e2;
  }));
  function Tf(t4) {
    return function(e2) {
      var r2 = new Sf(t4);
      r2.touches = r2.targetTouches = e2.touches, r2.changedTouches = e2.changedTouches, r2.timeStamp = e2.timeStamp, ni.dispatch(r2);
    };
  }
  wx.onTouchStart(Tf("touchstart")), wx.onTouchMove(Tf("touchmove")), wx.onTouchEnd(Tf("touchend")), wx.onTouchCancel(Tf("touchcancel"));
  var jf = Uo((function t3() {
    Ho(this, t3);
  }));
  var xf = { getItem: function(t4) {
    return wx.getStorageSync(t4);
  }, setItem: function(t4, e2) {
    return wx.setStorageSync(t4, e2);
  }, clear: function() {
    wx.clearStorageSync();
  } };
  var Pf = Date.now();
  var Af = Object.freeze({ __proto__: null, now: function() {
    return Date.now() - Pf;
  } });
  var Gf = { exports: {} };
  var Lf = is.map;
  Pr({ target: "Array", proto: true, forced: !bo("map") }, { map: function(t4) {
    return Lf(this, t4, arguments.length > 1 ? arguments[1] : void 0);
  } });
  var kf = dn("Array", "map");
  var Cf = it;
  var Rf = kf;
  var If = Array.prototype;
  var Nf = e(Gf.exports = function(t4) {
    var e2 = t4.map;
    return t4 === If || Cf(If, t4) && e2 === If.map ? Rf : e2;
  });
  var Mf = { exports: {} };
  var Df = A;
  var _f = a;
  var Ff = g;
  var zf = Sa;
  var Hf = Ui;
  var Wf = J;
  var Uf = Ff(C.f);
  var Vf = Ff([].push);
  var Bf = Df && _f((function() {
    var t4 = /* @__PURE__ */ Object.create(null);
    return t4[2] = 2, !Uf(t4, 2);
  }));
  var Xf = function(t4) {
    return function(e2) {
      for (var r2, n2 = Wf(e2), o2 = Hf(n2), i2 = Bf && null === zf(n2), a2 = o2.length, u2 = 0, c2 = []; a2 > u2; ) r2 = o2[u2++], Df && !(i2 ? r2 in n2 : Uf(n2, r2)) || Vf(c2, t4 ? [r2, n2[r2]] : n2[r2]);
      return c2;
    };
  };
  var qf = { entries: Xf(true), values: Xf(false) }.entries;
  Pr({ target: "Object", stat: true }, { entries: function(t4) {
    return qf(t4);
  } });
  var Kf = $.Object.entries;
  var Yf = e(Mf.exports = Kf);
  var Jf = { exports: {} };
  var Qf = {};
  Qf.f = Object.getOwnPropertySymbols;
  var Zf = ot;
  var $f = Fu;
  var tl = Qf;
  var el = er;
  var rl = g([].concat);
  var nl = Zf("Reflect", "ownKeys") || function(t4) {
    var e2 = $f.f(el(t4)), r2 = tl.f;
    return r2 ? rl(e2, r2(t4)) : e2;
  };
  var ol = Qt;
  var il = nl;
  var al = P;
  var ul = Je;
  var cl = Z;
  var sl = dr;
  var fl = Error;
  var ll = g("".replace);
  var pl = String(new fl("zxcasd").stack);
  var hl = /\n\s*at [^:]*:[^\n]*/;
  var vl = hl.test(pl);
  var dl = _;
  var yl = !a((function() {
    var t4 = new Error("a");
    return !("stack" in t4) || (Object.defineProperty(t4, "stack", dl(1, 7)), 7 !== t4.stack);
  }));
  var gl = dr;
  var ml = function(t4, e2) {
    if (vl && "string" == typeof t4 && !fl.prepareStackTrace) for (; e2--; ) t4 = ll(t4, hl, "");
    return t4;
  };
  var bl = yl;
  var wl = Error.captureStackTrace;
  var Ol = _n;
  var El = String;
  var Sl = function(t4) {
    if ("Symbol" === Ol(t4)) throw new TypeError("Cannot convert a Symbol value to a string");
    return El(t4);
  };
  var Tl = Sl;
  var jl = Pr;
  var xl = it;
  var Pl = Sa;
  var Al = uu;
  var Gl = function(t4, e2, r2) {
    for (var n2 = il(e2), o2 = ul.f, i2 = al.f, a2 = 0; a2 < n2.length; a2++) {
      var u2 = n2[a2];
      ol(t4, u2) || r2 && ol(r2, u2) || o2(t4, u2, i2(e2, u2));
    }
  };
  var Ll = va;
  var kl = dr;
  var Cl = _;
  var Rl = function(t4, e2) {
    cl(e2) && "cause" in e2 && sl(t4, "cause", e2.cause);
  };
  var Il = function(t4, e2, r2, n2) {
    bl && (wl ? wl(t4, e2) : gl(t4, "stack", ml(r2, n2)));
  };
  var Nl = Kc;
  var Ml = function(t4, e2) {
    return void 0 === t4 ? arguments.length < 2 ? "" : e2 : Tl(t4);
  };
  var Dl = le("toStringTag");
  var _l = Error;
  var Fl = [].push;
  var zl = function(t4, e2) {
    var r2, n2 = xl(Hl, this);
    Al ? r2 = Al(new _l(), n2 ? Pl(this) : Hl) : (r2 = n2 ? this : Ll(Hl), kl(r2, Dl, "Error")), void 0 !== e2 && kl(r2, "message", Ml(e2)), Il(r2, zl, r2.stack, 1), arguments.length > 2 && Rl(r2, arguments[2]);
    var o2 = [];
    return Nl(t4, Fl, { that: o2 }), kl(r2, "errors", o2), r2;
  };
  Al ? Al(zl, _l) : Gl(zl, _l, { name: true });
  var Hl = zl.prototype = Ll(_l.prototype, { constructor: Cl(1, zl), message: Cl(1, ""), name: Cl(1, "AggregateError") });
  jl({ global: true, constructor: true, arity: 2 }, { AggregateError: zl });
  var Wl;
  var Ul;
  var Vl;
  var Bl;
  var Xl = "process" === O(i.process);
  var ql = Je;
  var Kl = ot;
  var Yl = function(t4, e2, r2) {
    return ql.f(t4, e2, r2);
  };
  var Jl = A;
  var Ql = le("species");
  var Zl = ro;
  var $l = jt;
  var tp = TypeError;
  var ep = er;
  var rp = function(t4) {
    if (Zl(t4)) return t4;
    throw new tp($l(t4) + " is not a constructor");
  };
  var np = V;
  var op = le("species");
  var ip = function(t4, e2) {
    var r2, n2 = ep(t4).constructor;
    return void 0 === n2 || np(r2 = ep(n2)[op]) ? e2 : rp(r2);
  };
  var ap = TypeError;
  var up = /(?:ipad|iphone|ipod).*applewebkit/i.test(at);
  var cp = i;
  var sp = p;
  var fp = Ye;
  var lp = x;
  var pp = Qt;
  var hp = a;
  var vp = Qi;
  var dp = Uu;
  var yp = je;
  var gp = function(t4, e2) {
    if (t4 < e2) throw new ap("Not enough arguments");
    return t4;
  };
  var mp = up;
  var bp = Xl;
  var wp = cp.setImmediate;
  var Op = cp.clearImmediate;
  var Ep = cp.process;
  var Sp = cp.Dispatch;
  var Tp = cp.Function;
  var jp = cp.MessageChannel;
  var xp = cp.String;
  var Pp = 0;
  var Ap = {};
  var Gp = "onreadystatechange";
  hp((function() {
    Wl = cp.location;
  }));
  var Lp = function(t4) {
    if (pp(Ap, t4)) {
      var e2 = Ap[t4];
      delete Ap[t4], e2();
    }
  };
  var kp = function(t4) {
    return function() {
      Lp(t4);
    };
  };
  var Cp = function(t4) {
    Lp(t4.data);
  };
  var Rp = function(t4) {
    cp.postMessage(xp(t4), Wl.protocol + "//" + Wl.host);
  };
  wp && Op || (wp = function(t4) {
    gp(arguments.length, 1);
    var e2 = lp(t4) ? t4 : Tp(t4), r2 = dp(arguments, 1);
    return Ap[++Pp] = function() {
      sp(e2, void 0, r2);
    }, Ul(Pp), Pp;
  }, Op = function(t4) {
    delete Ap[t4];
  }, bp ? Ul = function(t4) {
    Ep.nextTick(kp(t4));
  } : Sp && Sp.now ? Ul = function(t4) {
    Sp.now(kp(t4));
  } : jp && !mp ? (Bl = (Vl = new jp()).port2, Vl.port1.onmessage = Cp, Ul = fp(Bl.postMessage, Bl)) : cp.addEventListener && lp(cp.postMessage) && !cp.importScripts && Wl && "file:" !== Wl.protocol && !hp(Rp) ? (Ul = Rp, cp.addEventListener("message", Cp, false)) : Ul = Gp in yp("script") ? function(t4) {
    vp.appendChild(yp("script"))[Gp] = function() {
      vp.removeChild(this), Lp(t4);
    };
  } : function(t4) {
    setTimeout(kp(t4), 0);
  });
  var Ip = { set: wp, clear: Op };
  var Np = i;
  var Mp = A;
  var Dp = Object.getOwnPropertyDescriptor;
  var _p = function() {
    this.head = null, this.tail = null;
  };
  _p.prototype = { add: function(t4) {
    var e2 = { item: t4, next: null }, r2 = this.tail;
    r2 ? r2.next = e2 : this.head = e2, this.tail = e2;
  }, get: function() {
    var t4 = this.head;
    if (t4) return null === (this.head = t4.next) && (this.tail = null), t4.item;
  } };
  var Fp;
  var zp;
  var Hp;
  var Wp;
  var Up;
  var Vp = _p;
  var Bp = /ipad|iphone|ipod/i.test(at) && "undefined" != typeof Pebble;
  var Xp = /web0s(?!.*chrome)/i.test(at);
  var qp = i;
  var Kp = function(t4) {
    if (!Mp) return Np[t4];
    var e2 = Dp(Np, t4);
    return e2 && e2.value;
  };
  var Yp = Ye;
  var Jp = Ip.set;
  var Qp = Vp;
  var Zp = up;
  var $p = Bp;
  var th = Xp;
  var eh = Xl;
  var rh = qp.MutationObserver || qp.WebKitMutationObserver;
  var nh = qp.document;
  var oh = qp.process;
  var ih = qp.Promise;
  var ah = Kp("queueMicrotask");
  if (!ah) {
    uh = new Qp(), ch = function() {
      var t4, e2;
      for (eh && (t4 = oh.domain) && t4.exit(); e2 = uh.get(); ) try {
        e2();
      } catch (t5) {
        throw uh.head && Fp(), t5;
      }
      t4 && t4.enter();
    };
    Zp || eh || th || !rh || !nh ? !$p && ih && ih.resolve ? ((Wp = ih.resolve(void 0)).constructor = ih, Up = Yp(Wp.then, Wp), Fp = function() {
      Up(ch);
    }) : eh ? Fp = function() {
      oh.nextTick(ch);
    } : (Jp = Yp(Jp, qp), Fp = function() {
      Jp(ch);
    }) : (zp = true, Hp = nh.createTextNode(""), new rh(ch).observe(Hp, { characterData: true }), Fp = function() {
      Hp.data = zp = !zp;
    }), ah = function(t4) {
      uh.head || Fp(), uh.add(t4);
    };
  }
  var uh;
  var ch;
  var sh = ah;
  var fh = function(t4) {
    try {
      return { error: false, value: t4() };
    } catch (t5) {
      return { error: true, value: t5 };
    }
  };
  var lh = i.Promise;
  var ph = "object" == typeof Deno && Deno && "object" == typeof Deno.version;
  var hh = !ph && !Xl && "object" == typeof window && "object" == typeof document;
  var vh = i;
  var dh = lh;
  var yh = x;
  var gh = Be;
  var mh = Un;
  var bh = le;
  var wh = hh;
  var Oh = ph;
  var Eh = ht;
  var Sh = dh && dh.prototype;
  var Th = bh("species");
  var jh = false;
  var xh = yh(vh.PromiseRejectionEvent);
  var Ph = gh("Promise", (function() {
    var t4 = mh(dh), e2 = t4 !== String(dh);
    if (!e2 && 66 === Eh) return true;
    if (!Sh.catch || !Sh.finally) return true;
    if (!Eh || Eh < 51 || !/native code/.test(t4)) {
      var r2 = new dh((function(t5) {
        t5(1);
      })), n2 = function(t5) {
        t5((function() {
        }), (function() {
        }));
      };
      if ((r2.constructor = {})[Th] = n2, !(jh = r2.then((function() {
      })) instanceof n2)) return true;
    }
    return !e2 && (wh || Oh) && !xh;
  }));
  var Ah = { CONSTRUCTOR: Ph, REJECTION_EVENT: xh, SUBCLASSING: jh };
  var Gh = {};
  var Lh = Gt;
  var kh = TypeError;
  var Ch = function(t4) {
    var e2, r2;
    this.promise = new t4((function(t5, n2) {
      if (void 0 !== e2 || void 0 !== r2) throw new kh("Bad Promise constructor");
      e2 = t5, r2 = n2;
    })), this.resolve = Lh(e2), this.reject = Lh(r2);
  };
  Gh.f = function(t4) {
    return new Ch(t4);
  };
  var Rh;
  var Ih;
  var Nh = Pr;
  var Mh = Xl;
  var Dh = i;
  var _h = k;
  var Fh = ja;
  var zh = Va;
  var Hh = function(t4) {
    var e2 = Kl(t4);
    Jl && e2 && !e2[Ql] && Yl(e2, Ql, { configurable: true, get: function() {
      return this;
    } });
  };
  var Wh = Gt;
  var Uh = x;
  var Vh = Z;
  var Bh = Qc;
  var Xh = ip;
  var qh = Ip.set;
  var Kh = sh;
  var Yh = function(t4, e2) {
    try {
      1 === arguments.length ? console.error(t4) : console.error(t4, e2);
    } catch (t5) {
    }
  };
  var Jh = fh;
  var Qh = Vp;
  var Zh = xi;
  var $h = lh;
  var tv = Ah;
  var ev = Gh;
  var rv = "Promise";
  var nv = tv.CONSTRUCTOR;
  var ov = tv.REJECTION_EVENT;
  var iv = Zh.getterFor(rv);
  var av = Zh.set;
  var uv = $h && $h.prototype;
  var cv = $h;
  var sv = uv;
  var fv = Dh.TypeError;
  var lv = Dh.document;
  var pv = Dh.process;
  var hv = ev.f;
  var vv = hv;
  var dv = !!(lv && lv.createEvent && Dh.dispatchEvent);
  var yv = "unhandledrejection";
  var gv = function(t4) {
    var e2;
    return !(!Vh(t4) || !Uh(e2 = t4.then)) && e2;
  };
  var mv = function(t4, e2) {
    var r2, n2, o2, i2 = e2.value, a2 = 1 === e2.state, u2 = a2 ? t4.ok : t4.fail, c2 = t4.resolve, s2 = t4.reject, f2 = t4.domain;
    try {
      u2 ? (a2 || (2 === e2.rejection && Sv(e2), e2.rejection = 1), true === u2 ? r2 = i2 : (f2 && f2.enter(), r2 = u2(i2), f2 && (f2.exit(), o2 = true)), r2 === t4.promise ? s2(new fv("Promise-chain cycle")) : (n2 = gv(r2)) ? _h(n2, r2, c2, s2) : c2(r2)) : s2(i2);
    } catch (t5) {
      f2 && !o2 && f2.exit(), s2(t5);
    }
  };
  var bv = function(t4, e2) {
    t4.notified || (t4.notified = true, Kh((function() {
      for (var r2, n2 = t4.reactions; r2 = n2.get(); ) mv(r2, t4);
      t4.notified = false, e2 && !t4.rejection && Ov(t4);
    })));
  };
  var wv = function(t4, e2, r2) {
    var n2, o2;
    dv ? ((n2 = lv.createEvent("Event")).promise = e2, n2.reason = r2, n2.initEvent(t4, false, true), Dh.dispatchEvent(n2)) : n2 = { promise: e2, reason: r2 }, !ov && (o2 = Dh["on" + t4]) ? o2(n2) : t4 === yv && Yh("Unhandled promise rejection", r2);
  };
  var Ov = function(t4) {
    _h(qh, Dh, (function() {
      var e2, r2 = t4.facade, n2 = t4.value;
      if (Ev(t4) && (e2 = Jh((function() {
        Mh ? pv.emit("unhandledRejection", n2, r2) : wv(yv, r2, n2);
      })), t4.rejection = Mh || Ev(t4) ? 2 : 1, e2.error)) throw e2.value;
    }));
  };
  var Ev = function(t4) {
    return 1 !== t4.rejection && !t4.parent;
  };
  var Sv = function(t4) {
    _h(qh, Dh, (function() {
      var e2 = t4.facade;
      Mh ? pv.emit("rejectionHandled", e2) : wv("rejectionhandled", e2, t4.value);
    }));
  };
  var Tv = function(t4, e2, r2) {
    return function(n2) {
      t4(e2, n2, r2);
    };
  };
  var jv = function(t4, e2, r2) {
    t4.done || (t4.done = true, r2 && (t4 = r2), t4.value = e2, t4.state = 2, bv(t4, true));
  };
  var xv = function(t4, e2, r2) {
    if (!t4.done) {
      t4.done = true, r2 && (t4 = r2);
      try {
        if (t4.facade === e2) throw new fv("Promise can't be resolved itself");
        var n2 = gv(e2);
        n2 ? Kh((function() {
          var r3 = { done: false };
          try {
            _h(n2, e2, Tv(xv, r3, t4), Tv(jv, r3, t4));
          } catch (e3) {
            jv(r3, e3, t4);
          }
        })) : (t4.value = e2, t4.state = 1, bv(t4, false));
      } catch (e3) {
        jv({ done: false }, e3, t4);
      }
    }
  };
  nv && (sv = (cv = function(t4) {
    Bh(this, sv), Wh(t4), _h(Rh, this);
    var e2 = iv(this);
    try {
      t4(Tv(xv, e2), Tv(jv, e2));
    } catch (t5) {
      jv(e2, t5);
    }
  }).prototype, (Rh = function(t4) {
    av(this, { type: rv, done: false, notified: false, parent: false, reactions: new Qh(), rejection: false, state: 0, value: void 0 });
  }).prototype = Fh(sv, "then", (function(t4, e2) {
    var r2 = iv(this), n2 = hv(Xh(this, cv));
    return r2.parent = true, n2.ok = !Uh(t4) || t4, n2.fail = Uh(e2) && e2, n2.domain = Mh ? pv.domain : void 0, 0 === r2.state ? r2.reactions.add(n2) : Kh((function() {
      mv(n2, r2);
    })), n2.promise;
  })), Ih = function() {
    var t4 = new Rh(), e2 = iv(t4);
    this.promise = t4, this.resolve = Tv(xv, e2), this.reject = Tv(jv, e2);
  }, ev.f = hv = function(t4) {
    return t4 === cv || void 0 === t4 ? new Ih(t4) : vv(t4);
  }), Nh({ global: true, constructor: true, wrap: true, forced: nv }, { Promise: cv }), zh(cv, rv, false, true), Hh(rv);
  var Pv = le("iterator");
  var Av = false;
  try {
    Gv = 0, Lv = { next: function() {
      return { done: !!Gv++ };
    }, return: function() {
      Av = true;
    } };
    Lv[Pv] = function() {
      return this;
    }, Array.from(Lv, (function() {
      throw 2;
    }));
  } catch (t4) {
  }
  var Gv;
  var Lv;
  var kv = lh;
  var Cv = function(t4, e2) {
    try {
      if (!e2 && !Av) return false;
    } catch (t5) {
      return false;
    }
    var r2 = false;
    try {
      var n2 = {};
      n2[Pv] = function() {
        return { next: function() {
          return { done: r2 = true };
        } };
      }, t4(n2);
    } catch (t5) {
    }
    return r2;
  };
  var Rv = Ah.CONSTRUCTOR || !Cv((function(t4) {
    kv.all(t4).then(void 0, (function() {
    }));
  }));
  var Iv = k;
  var Nv = Gt;
  var Mv = Gh;
  var Dv = fh;
  var _v = Kc;
  Pr({ target: "Promise", stat: true, forced: Rv }, { all: function(t4) {
    var e2 = this, r2 = Mv.f(e2), n2 = r2.resolve, o2 = r2.reject, i2 = Dv((function() {
      var r3 = Nv(e2.resolve), i3 = [], a2 = 0, u2 = 1;
      _v(t4, (function(t5) {
        var c2 = a2++, s2 = false;
        u2++, Iv(r3, e2, t5).then((function(t6) {
          s2 || (s2 = true, i3[c2] = t6, --u2 || n2(i3));
        }), o2);
      })), --u2 || n2(i3);
    }));
    return i2.error && o2(i2.value), r2.promise;
  } });
  var Fv = Pr;
  var zv = Ah.CONSTRUCTOR;
  lh && lh.prototype, Fv({ target: "Promise", proto: true, forced: zv, real: true }, { catch: function(t4) {
    return this.then(void 0, t4);
  } });
  var Hv = k;
  var Wv = Gt;
  var Uv = Gh;
  var Vv = fh;
  var Bv = Kc;
  Pr({ target: "Promise", stat: true, forced: Rv }, { race: function(t4) {
    var e2 = this, r2 = Uv.f(e2), n2 = r2.reject, o2 = Vv((function() {
      var o3 = Wv(e2.resolve);
      Bv(t4, (function(t5) {
        Hv(o3, e2, t5).then(r2.resolve, n2);
      }));
    }));
    return o2.error && n2(o2.value), r2.promise;
  } });
  var Xv = Gh;
  Pr({ target: "Promise", stat: true, forced: Ah.CONSTRUCTOR }, { reject: function(t4) {
    var e2 = Xv.f(this);
    return (0, e2.reject)(t4), e2.promise;
  } });
  var qv = er;
  var Kv = Z;
  var Yv = Gh;
  var Jv = function(t4, e2) {
    if (qv(t4), Kv(e2) && e2.constructor === t4) return e2;
    var r2 = Yv.f(t4);
    return (0, r2.resolve)(e2), r2.promise;
  };
  var Qv = Pr;
  var Zv = lh;
  var $v = Ah.CONSTRUCTOR;
  var td = Jv;
  var ed = ot("Promise");
  var rd = !$v;
  Qv({ target: "Promise", stat: true, forced: true }, { resolve: function(t4) {
    return td(rd && this === ed ? Zv : this, t4);
  } });
  var nd = k;
  var od = Gt;
  var id = Gh;
  var ad = fh;
  var ud = Kc;
  Pr({ target: "Promise", stat: true, forced: Rv }, { allSettled: function(t4) {
    var e2 = this, r2 = id.f(e2), n2 = r2.resolve, o2 = r2.reject, i2 = ad((function() {
      var r3 = od(e2.resolve), o3 = [], i3 = 0, a2 = 1;
      ud(t4, (function(t5) {
        var u2 = i3++, c2 = false;
        a2++, nd(r3, e2, t5).then((function(t6) {
          c2 || (c2 = true, o3[u2] = { status: "fulfilled", value: t6 }, --a2 || n2(o3));
        }), (function(t6) {
          c2 || (c2 = true, o3[u2] = { status: "rejected", reason: t6 }, --a2 || n2(o3));
        }));
      })), --a2 || n2(o3);
    }));
    return i2.error && o2(i2.value), r2.promise;
  } });
  var cd = k;
  var sd = Gt;
  var fd = ot;
  var ld = Gh;
  var pd = fh;
  var hd = Kc;
  var vd = "No one promise resolved";
  Pr({ target: "Promise", stat: true, forced: Rv }, { any: function(t4) {
    var e2 = this, r2 = fd("AggregateError"), n2 = ld.f(e2), o2 = n2.resolve, i2 = n2.reject, a2 = pd((function() {
      var n3 = sd(e2.resolve), a3 = [], u2 = 0, c2 = 1, s2 = false;
      hd(t4, (function(t5) {
        var f2 = u2++, l2 = false;
        c2++, cd(n3, e2, t5).then((function(t6) {
          l2 || s2 || (s2 = true, o2(t6));
        }), (function(t6) {
          l2 || s2 || (l2 = true, a3[f2] = t6, --c2 || i2(new r2(a3, vd)));
        }));
      })), --c2 || i2(new r2(a3, vd));
    }));
    return a2.error && i2(a2.value), n2.promise;
  } });
  var dd = Gh;
  Pr({ target: "Promise", stat: true }, { withResolvers: function() {
    var t4 = dd.f(this);
    return { promise: t4.promise, resolve: t4.resolve, reject: t4.reject };
  } });
  var yd = Pr;
  var gd = lh;
  var md = a;
  var bd = ot;
  var wd = x;
  var Od = ip;
  var Ed = Jv;
  var Sd = gd && gd.prototype;
  yd({ target: "Promise", proto: true, real: true, forced: !!gd && md((function() {
    Sd.finally.call({ then: function() {
    } }, (function() {
    }));
  })) }, { finally: function(t4) {
    var e2 = Od(this, bd("Promise")), r2 = wd(t4);
    return this.then(r2 ? function(r3) {
      return Ed(e2, t4()).then((function() {
        return r3;
      }));
    } : t4, r2 ? function(r3) {
      return Ed(e2, t4()).then((function() {
        throw r3;
      }));
    } : t4);
  } });
  var Td = g;
  var jd = Xr;
  var xd = Sl;
  var Pd = q;
  var Ad = Td("".charAt);
  var Gd = Td("".charCodeAt);
  var Ld = Td("".slice);
  var kd = function(t4) {
    return function(e2, r2) {
      var n2, o2, i2 = xd(Pd(e2)), a2 = jd(r2), u2 = i2.length;
      return a2 < 0 || a2 >= u2 ? t4 ? "" : void 0 : (n2 = Gd(i2, a2)) < 55296 || n2 > 56319 || a2 + 1 === u2 || (o2 = Gd(i2, a2 + 1)) < 56320 || o2 > 57343 ? t4 ? Ad(i2, a2) : n2 : t4 ? Ld(i2, a2, a2 + 2) : o2 - 56320 + (n2 - 55296 << 10) + 65536;
    };
  };
  var Cd = { codeAt: kd(false), charAt: kd(true) }.charAt;
  var Rd = Sl;
  var Id = xi;
  var Nd = Tu;
  var Md = ju;
  var Dd = "String Iterator";
  var _d = Id.set;
  var Fd = Id.getterFor(Dd);
  Nd(String, "String", (function(t4) {
    _d(this, { type: Dd, string: Rd(t4), index: 0 });
  }), (function() {
    var t4, e2 = Fd(this), r2 = e2.string, n2 = e2.index;
    return n2 >= r2.length ? Md(void 0, true) : (t4 = Cd(r2, n2), e2.index += t4.length, Md(t4, false));
  }));
  var zd = e(Jf.exports = $.Promise);
  var Hd = (function() {
    function t4() {
      Ho(this, t4), Vo(this, "method", "GET"), Vo(this, "dataType", "text"), Vo(this, "responseType", "utf-8"), Vo(this, "onreadystatechange", Dr), Vo(this, "onloadend", Dr), Vo(this, "onerror", Dr), Vo(this, "event", {}), Vo(this, "responseHeader", {}), Vo(this, "header", { Accept: "*/*" });
    }
    return Uo(t4, [{ key: "open", value: function(e2, r2) {
      this.method = e2, this.url = r2, this.readyState = t4.OPENED;
    } }, { key: "setRequestHeader", value: function(t5, e2) {
      this.header[t5] = e2;
    } }, { key: "addEventListener", value: function(t5, e2) {
      this.event[t5] = this.event[t5] || [], this.event[t5].push(e2);
    } }, { key: "getResponseHeader", value: function(t5) {
      return this.responseHeader && this.responseHeader[t5];
    } }, { key: "getAllResponseHeaders", value: function() {
      var t5, e2 = this.responseHeader || {};
      return Nf(t5 = Yf(e2)).call(t5, (function(t6) {
        return t6.join(": ");
      })).join("\r\n");
    } }, { key: "emit", value: function(t5) {
      var e2 = this, r2 = this.event[t5], n2 = { type: t5, target: this, method: this.method, response: this.response, responseText: this.responseText, responseType: this.responseType };
      r2 && r2.forEach((function(t6) {
        return t6.call(e2, n2);
      })), "load" === t5 && this.onload && this.onload(n2), "error" === t5 && this.onerror && this.onerror(n2);
    } }, { key: "readFile", value: function(t5, e2) {
      return new zd((function(r2, n2) {
        wx.getFileSystemManager().readFile({ encoding: e2, filePath: t5, success: function(t6) {
          return r2(t6.data);
        }, fail: n2 });
      }));
    } }, { key: "send", value: function(e2) {
      var r2 = this;
      this.readyState = t4.LOADING, this.url.match(/^(http(s)?:\/\/)\w+[^\s]+(\.[^\s]+){1,}/) ? wx.request({ data: e2, url: this.url, header: this.header, method: this.method, dataType: this.dataType, responseType: "text" === this.responseType || "arraybuffer" === this.responseType ? this.responseType : "text", success: function(e3) {
        r2.readyState = t4.DONE, r2.responseHeader = e3.header, r2.status = e3.statusCode, r2.response = r2.responseText = e3.data, r2.emit("load"), r2.emit("readystatechange"), r2.onloadend(), r2.onreadystatechange();
      }, fail: function(e3) {
        console.log("error", e3), r2.readyState = t4.DONE, r2.status = e3.statusCode, r2.response = r2.responseText = e3, r2.responseHeader = e3.header, r2.emit("error"), r2.emit("readystatechange"), r2.onerror(), r2.onreadystatechange();
      } }) : (this.readyState = t4.DONE, this.status = 200, this.readFile(this.url, "text" === this.responseType ? "utf-8" : this.responseType).then((function(t5) {
        r2.response = r2.responseText = t5, r2.emit("readystatechange"), r2.emit("load");
      })).catch((function(t5) {
        r2.response = r2.responseText = t5, r2.emit("error");
      })));
    } }]);
  })();
  Vo(Hd, "UNSEND", 0), Vo(Hd, "OPENED", 1), Vo(Hd, "HEADERS_RECEIVED", 2), Vo(Hd, "LOADING", 3), Vo(Hd, "DONE", 4);
  var Wd = wx.getSystemInfoSync().platform;
  if (GameGlobal.canvas = Hr, Hr.addEventListener = ni.addEventListener, Hr.removeEventListener = ni.removeEventListener, "devtools" === Wd) for (Ud in Object.defineProperties(window, { Image: { value: _r }, Element: { value: Ko }, ontouchstart: { value: Dr }, WebSocket: { value: Ef }, addEventListener: { value: Dr }, TouchEvent: { value: Sf }, XMLDocument: { value: jf }, localStorage: { value: xf }, XMLHttpRequest: { value: Hd }, HTMLVideoElement: { value: Qo }, HTMLImageElement: { value: Jo }, HTMLCanvasElement: { value: Yo } }), ni) {
    Vd = Mr(window.document, Ud);
    Vd && !Vd.configurable || Object.defineProperty(window.document, Ud, { value: ni[Ud] });
  }
  else GameGlobal.Image = _r, GameGlobal.self = GameGlobal, GameGlobal.window = GameGlobal, GameGlobal.ontouchstart = Dr, GameGlobal.document = ni, GameGlobal.location = { origin: "", href: "" }, GameGlobal.WebSocket = Ef, GameGlobal.navigator = { language: "zh-cn", appVersion: "5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36", userAgent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36", onLine: true }, GameGlobal.TouchEvent = Sf, GameGlobal.addEventListener = Dr, GameGlobal.performance = Af, GameGlobal.XMLDocument = jf, GameGlobal.removeEventListener = Dr, GameGlobal.localStorage = xf, GameGlobal.XMLHttpRequest = Hd, GameGlobal.HTMLImageElement = "Object" !== Fr.constructor.name ? Fr.constructor : Jo, GameGlobal.HTMLVideoElement = Qo, GameGlobal.HTMLCanvasElement = Yo, GameGlobal.WebGLRenderingContext = GameGlobal.WebGLRenderingContext || {};
  var Vd;
  var Ud;

  // ../../packages/mc2d/src/assets/asset-manager.js
  var AssetManager = class {
    constructor(platform) {
      this.platform = platform;
      this.pathFormatters = /* @__PURE__ */ Object.create(null);
      this.images = /* @__PURE__ */ Object.create(null);
      this.audio = /* @__PURE__ */ Object.create(null);
    }
    setPathFormatter(type, formatter) {
      this.pathFormatters[type] = formatter;
    }
    resolve(key, type = "") {
      const formatter = this.pathFormatters[type];
      return formatter ? formatter(key) : key;
    }
    image(key, type = "") {
      const path = this.resolve(key, type);
      if (!this.images[path]) this.images[path] = this.createImageRecord(path);
      return this.images[path];
    }
    loadImage(key, type = "") {
      return this.image(key, type).promise;
    }
    preloadImages(keys, type = "") {
      return Promise.all(keys.map((key) => this.loadImage(key, type)));
    }
    createImageRecord(path) {
      const image = this.platform.createImage();
      const record = {
        path,
        image,
        status: "loading",
        error: null,
        width: 0,
        height: 0,
        promise: null
      };
      record.promise = new Promise((resolve, reject) => {
        image.onload = () => {
          record.status = "loaded";
          record.width = image.width;
          record.height = image.height;
          resolve(record);
        };
        image.onerror = (error) => {
          record.status = "error";
          record.error = error || new Error(`Image load failed: ${path}`);
          reject(record.error);
        };
      });
      image.src = path;
      return record;
    }
    sound(key, type = "") {
      const path = this.resolve(key, type);
      if (!this.audio[path]) {
        const audio = this.platform.createAudio();
        audio.src = path;
        this.audio[path] = audio;
      }
      return this.audio[path];
    }
  };

  // ../../packages/mc2d/src/assets/audio-manager.js
  var AudioManager = class {
    constructor(assetManager) {
      this.assets = assetManager;
      this.bgmEnabled = true;
      this.sfxEnabled = true;
      this.bgmAudio = null;
    }
    enableBgm(enabled) {
      this.bgmEnabled = !!enabled;
      if (!this.bgmEnabled && this.bgmAudio) this.bgmAudio.pause();
    }
    enableSfx(enabled) {
      this.sfxEnabled = !!enabled;
    }
    playSfx(key, type = "") {
      if (!this.sfxEnabled) return null;
      const audio = this.assets.sound(key, type);
      try {
        audio.currentTime = 0;
        audio.play();
      } catch (e2) {
      }
      return audio;
    }
    playBgm(key, type = "") {
      if (!this.bgmEnabled) return null;
      const audio = this.assets.sound(key, type);
      if (this.bgmAudio && this.bgmAudio !== audio) this.bgmAudio.pause();
      this.bgmAudio = audio;
      try {
        audio.currentTime = 0;
        audio.loop = true;
        audio.play();
      } catch (e2) {
      }
      return audio;
    }
    stopBgm() {
      if (!this.bgmAudio) return;
      this.bgmAudio.pause();
      this.bgmAudio = null;
    }
  };

  // ../../packages/mc2d/src/state/event-emitter.js
  var EventEmitter = class {
    constructor() {
      this.listeners = /* @__PURE__ */ Object.create(null);
    }
    on(type, handler) {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push(handler);
      return () => this.off(type, handler);
    }
    once(type, handler) {
      const off = this.on(type, (...args) => {
        off();
        handler(...args);
      });
      return off;
    }
    off(type, handler) {
      const listeners = this.listeners[type];
      if (!listeners) return;
      const index = listeners.indexOf(handler);
      if (index >= 0) listeners.splice(index, 1);
      if (listeners.length === 0) delete this.listeners[type];
    }
    emit(type, ...args) {
      const listeners = this.listeners[type];
      if (!listeners) return false;
      listeners.slice().forEach((handler) => handler(...args));
      return true;
    }
    removeAllListeners(type = null) {
      if (type) delete this.listeners[type];
      else this.listeners = /* @__PURE__ */ Object.create(null);
    }
  };

  // ../../packages/mc2d/src/math/rect.js
  var Rect = class _Rect {
    constructor(x2 = 0, y2 = 0, width = 0, height = 0) {
      this.set(x2, y2, width, height);
    }
    set(x2 = 0, y2 = 0, width = 0, height = 0) {
      this.x = x2;
      this.y = y2;
      this.width = width;
      this.height = height;
      return this;
    }
    copyFrom(rect) {
      return this.set(rect.x, rect.y, rect.width, rect.height);
    }
    clone() {
      return new _Rect(this.x, this.y, this.width, this.height);
    }
    equals(rect) {
      return this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height;
    }
    contains(x2, y2) {
      return x2 >= this.x && y2 >= this.y && x2 <= this.x + this.width && y2 <= this.y + this.height;
    }
    get empty() {
      return this.width <= 0 || this.height <= 0;
    }
  };

  // ../../packages/mc2d/src/display/display-object.js
  var nextDisplayObjectId = 1;
  var DisplayObject = class extends EventEmitter {
    constructor() {
      super();
      this.id = nextDisplayObjectId++;
      this.name = `${this.constructor.name} ${this.id}`;
      this.parent = null;
      this.stage = null;
      this.layout = null;
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.scaleX = 1;
      this.scaleY = 1;
      this.alpha = 1;
      this.visible = true;
      this.touchEnabled = false;
      this.bounds = new Rect();
      this.worldBounds = new Rect();
      this.dirtyLayout = true;
      this.dirtyPaint = true;
      this.dirtyTransform = true;
    }
    get tap() {
      return this._tap || null;
    }
    set tap(handler) {
      if (this._tap) this.off("tap", this._tap);
      this._tap = typeof handler === "function" ? handler : null;
      if (this._tap) {
        this.touchEnabled = true;
        this.on("tap", this._tap);
      }
    }
    get touchstart() {
      return this._touchstart || null;
    }
    set touchstart(handler) {
      if (this._touchstart) this.off("pointerdown", this._touchstart);
      this._touchstart = typeof handler === "function" ? handler : null;
      if (this._touchstart) {
        this.touchEnabled = true;
        this.on("pointerdown", this._touchstart);
      }
    }
    get touchmove() {
      return this._touchmove || null;
    }
    set touchmove(handler) {
      if (this._touchmove) this.off("pointermove", this._touchmove);
      this._touchmove = typeof handler === "function" ? handler : null;
      if (this._touchmove) {
        this.touchEnabled = true;
        this.on("pointermove", this._touchmove);
      }
    }
    get touchend() {
      return this._touchend || null;
    }
    set touchend(handler) {
      if (this._touchend) this.off("pointerup", this._touchend);
      this._touchend = typeof handler === "function" ? handler : null;
      if (this._touchend) {
        this.touchEnabled = true;
        this.on("pointerup", this._touchend);
      }
    }
    setLayout(layout) {
      this.layout = layout;
      this.invalidateLayout();
      return this;
    }
    setStage(stage) {
      this.stage = stage;
    }
    remove() {
      if (this.parent) this.parent.removeChild(this);
      return this;
    }
    setFrame(x2, y2, width, height) {
      if (this.x === x2 && this.y === y2 && this.width === width && this.height === height) {
        return this;
      }
      this.x = x2;
      this.y = y2;
      this.width = width;
      this.height = height;
      this.invalidateLayout();
      return this;
    }
    invalidateLayout() {
      this.dirtyLayout = true;
      this.invalidateTransform();
    }
    invalidateTransform() {
      this.dirtyTransform = true;
      this.invalidatePaint();
    }
    invalidatePaint() {
      this.dirtyPaint = true;
      if (this.parent) this.parent.invalidatePaint();
      else if (this.stage) this.stage.requestRender();
    }
    update(dt2) {
    }
    onScreenResize(systemInfo) {
    }
    measure(parentBounds) {
      if (this.layout) this.layout.applyTo(this, parentBounds);
    }
    updateWorldBounds(parentWorldX = 0, parentWorldY = 0) {
      const x2 = parentWorldX + this.x;
      const y2 = parentWorldY + this.y;
      this.bounds.set(this.x, this.y, this.width, this.height);
      this.worldBounds.set(x2, y2, this.width * this.scaleX, this.height * this.scaleY);
      this.dirtyTransform = false;
    }
    layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
      this.measure(parentBounds);
      this.updateWorldBounds(parentWorldX, parentWorldY);
      this.dirtyLayout = false;
    }
    render(ctx) {
      if (!this.visible || this.alpha <= 0 || this.worldBounds.empty) return;
      ctx.save();
      ctx.globalAlpha *= this.alpha;
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, this.scaleY);
      this.draw(ctx);
      ctx.restore();
      this.dirtyPaint = false;
    }
    draw(ctx) {
    }
    containsPoint(x2, y2) {
      return this.visible && this.worldBounds.contains(x2, y2);
    }
    hitTest(x2, y2) {
      if (!this.touchEnabled || !this.containsPoint(x2, y2)) return null;
      return this;
    }
    dispatch(event) {
      event.currentTarget = this;
      this.emit(event.type, event);
      return event.propagationStopped;
    }
  };

  // ../../packages/mc2d/src/display/container.js
  var Container = class extends DisplayObject {
    constructor() {
      super();
      this.children = [];
      this.childLayout = null;
    }
    get numChildren() {
      return this.children.length;
    }
    setChildLayout(layout) {
      this.childLayout = layout;
      this.invalidateLayout();
      return this;
    }
    setStage(stage) {
      super.setStage(stage);
      this.children.forEach((child) => child.setStage(stage));
    }
    addChild(child) {
      if (child.parent === this) return child;
      if (child.parent) child.parent.removeChild(child);
      child.parent = this;
      child.setStage(this.stage);
      this.children.push(child);
      this.invalidateLayout();
      return child;
    }
    addChildAt(child, index) {
      if (child.parent) child.parent.removeChild(child);
      child.parent = this;
      child.setStage(this.stage);
      this.children.splice(index, 0, child);
      this.invalidateLayout();
      return child;
    }
    getChild(index) {
      return this.children[index] || null;
    }
    setOrder(child, order) {
      const index = this.children.indexOf(child);
      if (index < 0) return child;
      this.children.splice(index, 1);
      this.children.splice(Math.max(0, Math.min(order, this.children.length)), 0, child);
      this.invalidatePaint();
      return child;
    }
    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index < 0) return child;
      this.children.splice(index, 1);
      child.parent = null;
      child.setStage(null);
      this.invalidateLayout();
      return child;
    }
    removeChildren() {
      this.children.slice().forEach((child) => this.removeChild(child));
    }
    forEach(handler) {
      this.children.forEach((child) => {
        if (handler(child)) return;
        if (child.forEach) child.forEach(handler);
      });
    }
    bubble(handler) {
      for (let i2 = this.children.length - 1; i2 >= 0; i2--) {
        const child = this.children[i2];
        if (child.bubble && child.bubble(handler)) return true;
        if (handler(child)) return true;
      }
      return false;
    }
    update(dt2) {
      this.children.forEach((child) => child.update(dt2));
    }
    layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
      super.layoutSelf(parentBounds, parentWorldX, parentWorldY);
      if (this.childLayout) this.childLayout.layoutChildren(this);
      else if (this.layout && this.layout.layoutChildren) this.layout.layoutChildren(this);
      const childParentBounds = this.worldBounds;
      this.children.forEach((child) => {
        child.layoutSelf(childParentBounds, this.worldBounds.x, this.worldBounds.y);
      });
    }
    render(ctx) {
      if (!this.visible || this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha *= this.alpha;
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, this.scaleY);
      this.draw(ctx);
      this.children.forEach((child) => child.render(ctx));
      ctx.restore();
      this.dirtyPaint = false;
    }
    hitTest(x2, y2) {
      if (!this.visible || !this.containsPoint(x2, y2)) return null;
      for (let i2 = this.children.length - 1; i2 >= 0; i2--) {
        const target2 = this.children[i2].hitTest(x2, y2);
        if (target2) return target2;
      }
      return this.touchEnabled ? this : null;
    }
  };

  // ../../packages/mc2d/src/display/graphics/graphic.js
  var Graphic = class extends DisplayObject {
    constructor(options = {}) {
      super();
      this.options = Object.assign({
        fillStyle: "#fff",
        strokeStyle: "",
        lineWidth: 1
      }, options);
    }
    setOptions(options) {
      Object.assign(this.options, options);
      this.invalidatePaint();
      return this;
    }
  };

  // ../../packages/mc2d/src/display/graphics/login-button.js
  var LoginButton = class extends Graphic {
    constructor(platform, options = {}, type = "text", value = "\u767B\u5F55") {
      super(Object.assign({
        textAlign: "center",
        lineHeight: 40,
        fontSize: 16,
        borderRadius: 4
      }, options));
      this.button = platform && platform.createUserInfoButton ? platform.createUserInfoButton({ type, [type]: value, style: this.options }) : null;
    }
    onTap(handler) {
      if (this.button && this.button.onTap) this.button.onTap(handler);
      return this;
    }
    destroy() {
      if (this.button && this.button.destroy) this.button.destroy();
    }
    draw() {
      if (!this.button || !this.button.style) return;
      const style = this.button.style;
      style.left = this.worldBounds.x;
      style.top = this.worldBounds.y;
      style.width = this.worldBounds.width;
      style.height = this.worldBounds.height;
    }
  };

  // ../../packages/mc2d/src/input/pointer-event.js
  var PointerEvent = class {
    constructor(type, data) {
      this.type = type;
      this.pointerId = data.pointerId || 0;
      this.x = data.x;
      this.y = data.y;
      this.startX = data.startX;
      this.startY = data.startY;
      this.deltaX = data.deltaX || 0;
      this.deltaY = data.deltaY || 0;
      this.target = data.target || null;
      this.currentTarget = null;
      this.originalEvent = data.originalEvent || null;
      this.propagationStopped = false;
    }
    stopPropagation() {
      this.propagationStopped = true;
    }
  };

  // ../../packages/mc2d/src/input/input-manager.js
  var TAP_DISTANCE = 10;
  var TAP_DURATION = 350;
  function getTouch(event) {
    const list = event.changedTouches && event.changedTouches.length ? event.changedTouches : event.touches;
    return list && list[0];
  }
  var InputManager = class {
    constructor(stage, platform) {
      this.stage = stage;
      this.platform = platform;
      this.unbind = null;
      this.active = null;
      this.touchPoint = null;
      this.touchMoveVector = { x: 0, y: 0, fixedX: 0, fixedY: 0 };
      this.handleStart = this.handleStart.bind(this);
      this.handleMove = this.handleMove.bind(this);
      this.handleEnd = this.handleEnd.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
    }
    bind(canvas) {
      this.destroy();
      this.unbind = this.platform.bindTouch(canvas, {
        start: this.handleStart,
        move: this.handleMove,
        end: this.handleEnd,
        cancel: this.handleCancel
      });
    }
    destroy() {
      if (this.unbind) this.unbind();
      this.unbind = null;
      this.active = null;
    }
    toPoint(event) {
      const touch = getTouch(event);
      if (!touch) return null;
      return {
        pointerId: touch.identifier || 0,
        x: touch.clientX,
        y: touch.clientY
      };
    }
    getTouchPoint() {
      return this.touchPoint || { x: -1, y: -1 };
    }
    getTouchMoveVector() {
      return this.touchMoveVector;
    }
    bubble(target2, event) {
      let node = target2;
      while (node) {
        if (node.dispatch(event)) return;
        node = node.parent;
      }
    }
    emit(type, target2, point, originalEvent, extra = {}) {
      const event = new PointerEvent(type, Object.assign({}, extra, {
        pointerId: point.pointerId,
        x: point.x,
        y: point.y,
        target: target2,
        originalEvent
      }));
      this.bubble(target2, event);
      return event;
    }
    handleStart(event) {
      const point = this.toPoint(event);
      if (!point || this.active) return;
      const target2 = this.stage.hitTest(point.x, point.y);
      if (!target2) return;
      this.active = {
        target: target2,
        pointerId: point.pointerId,
        startX: point.x,
        startY: point.y,
        lastX: point.x,
        lastY: point.y,
        time: Date.now()
      };
      this.touchPoint = { x: point.x, y: point.y };
      this.touchMoveVector.x = this.touchMoveVector.y = 0;
      this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
      this.emit("pointerdown", target2, point, event, {
        startX: point.x,
        startY: point.y
      });
    }
    handleMove(event) {
      const point = this.toPoint(event);
      const active = this.active;
      if (!point || !active) return;
      const deltaX = point.x - active.lastX;
      const deltaY = point.y - active.lastY;
      this.touchPoint = { x: point.x, y: point.y };
      this.touchMoveVector.x = this.touchMoveVector.fixedX = deltaX;
      this.touchMoveVector.y = this.touchMoveVector.fixedY = deltaY;
      active.lastX = point.x;
      active.lastY = point.y;
      this.emit("pointermove", active.target, point, event, {
        startX: active.startX,
        startY: active.startY,
        deltaX,
        deltaY
      });
    }
    handleEnd(event) {
      const point = this.toPoint(event);
      const active = this.active;
      if (!point || !active) return;
      this.emit("pointerup", active.target, point, event, {
        startX: active.startX,
        startY: active.startY,
        deltaX: point.x - active.lastX,
        deltaY: point.y - active.lastY
      });
      const dx = point.x - active.startX;
      const dy = point.y - active.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= TAP_DISTANCE && Date.now() - active.time <= TAP_DURATION) {
        const endTarget = this.stage.hitTest(point.x, point.y);
        if (endTarget === active.target) {
          this.emit("tap", active.target, point, event, {
            startX: active.startX,
            startY: active.startY
          });
        }
      }
      this.active = null;
      this.touchPoint = null;
      this.touchMoveVector.x = this.touchMoveVector.y = 0;
      this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
    }
    handleCancel(event) {
      const point = this.toPoint(event);
      const active = this.active;
      if (point && active) {
        this.emit("pointercancel", active.target, point, event, {
          startX: active.startX,
          startY: active.startY
        });
      }
      this.active = null;
      this.touchPoint = null;
      this.touchMoveVector.x = this.touchMoveVector.y = 0;
      this.touchMoveVector.fixedX = this.touchMoveVector.fixedY = 0;
    }
  };

  // ../../packages/mc2d/src/app/canvas-scale.js
  function applyCanvasScale(ctx, pixelRatio, allowScaleFallback = false) {
    if (ctx.setTransform) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    } else if (allowScaleFallback) {
      ctx.scale(pixelRatio, pixelRatio);
    }
  }

  // ../../packages/mc2d/src/app/stage.js
  var Stage = class extends Container {
    constructor(app2) {
      super();
      this.app = app2;
      this.touchEnabled = true;
      this.setStage(this);
      this.viewport = new Rect();
      this.renderRequested = true;
    }
    resize(width, height) {
      this.setFrame(0, 0, width, height);
      this.viewport.set(0, 0, width, height);
      this.worldBounds.set(0, 0, width, height);
      this.renderRequested = true;
    }
    requestRender() {
      this.renderRequested = true;
    }
    layoutTree() {
      this.layoutSelf(this.viewport, 0, 0);
    }
    renderStage(ctx) {
      const { width, height } = this.viewport;
      if (width <= 0 || height <= 0) return;
      ctx.clearRect(0, 0, width, height);
      this.children.forEach((child) => child.render(ctx));
      if (this.app.sharedCanvas) ctx.drawImage(this.app.sharedCanvas, 0, 0, width, height);
      this.renderRequested = false;
      this.dirtyPaint = false;
    }
  };

  // ../../packages/mc2d/src/app/mc2d-app.js
  var noop = () => {
  };
  var Mc2dApp = class extends EventEmitter {
    constructor(options = {}) {
      super();
      const { platform, canvas, fps = 60, autoRender = true } = options;
      if (!platform) throw new Error("Mc2dApp requires a platform adapter");
      if (!canvas) throw new Error("Mc2dApp requires a canvas");
      this.platform = platform;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.fps = fps;
      this.autoRender = autoRender;
      this.running = false;
      this.frameId = 0;
      this.lastTime = 0;
      this.scaleInitialized = false;
      this.minFrameTime = fps > 0 ? 1e3 / fps : 0;
      this.assets = new AssetManager(platform);
      this.audio = new AudioManager(this.assets);
      this.stage = new Stage(this);
      this.rootLayer = new Container();
      this.effects = new Container();
      this.topLayer = new Container();
      this.layers = {
        root: this.rootLayer,
        effects: this.effects,
        top: this.topLayer
      };
      this.input = new InputManager(this.stage, platform);
      this.input.bind(canvas);
      this.sharedContext = platform.getOpenDataContext ? platform.getOpenDataContext() : null;
      this.sharedCanvas = this.sharedContext && this.sharedContext.canvas;
      this.tick = this.tick.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.handleHide = this.handleHide.bind(this);
      if (platform.setFPS) platform.setFPS(fps);
      if (platform.onShow) this.unbindShow = platform.onShow(this.handleShow);
      if (platform.onHide) this.unbindHide = platform.onHide(this.handleHide);
      this.resize();
    }
    setRoot(root) {
      this.stage.removeChildren();
      this.rootLayer.removeChildren();
      this.stage.addChild(this.rootLayer);
      this.stage.addChild(this.effects);
      this.stage.addChild(this.topLayer);
      if (root) this.rootLayer.addChild(root);
      this.stage.requestRender();
      this.stage.layoutTree();
      this.stage.update(0);
      this.stage.layoutTree();
      this.render();
      return root;
    }
    start(root = null) {
      if (root) this.setRoot(root);
      if (this.running) return;
      this.running = true;
      this.lastTime = 0;
      this.frameId = this.platform.requestAnimationFrame(this.tick);
    }
    stop() {
      this.running = false;
      if (this.frameId) this.platform.cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
    resize(info = null) {
      const systemInfo = info || this.platform.getSystemInfo();
      const width = systemInfo.windowWidth || systemInfo.width || this.canvas.width || 0;
      const height = systemInfo.windowHeight || systemInfo.height || this.canvas.height || 0;
      const pixelRatio = systemInfo.pixelRatio || 1;
      this.systemInfo = systemInfo;
      this.width = width;
      this.height = height;
      this.pixelRatio = pixelRatio;
      const backingWidth = Math.round(width * pixelRatio);
      const backingHeight = Math.round(height * pixelRatio);
      const resized = this.canvas.width !== backingWidth || this.canvas.height !== backingHeight;
      if (this.canvas.width !== backingWidth) this.canvas.width = backingWidth;
      if (this.canvas.height !== backingHeight) this.canvas.height = backingHeight;
      applyCanvasScale(this.ctx, pixelRatio, resized || !this.scaleInitialized);
      this.scaleInitialized = true;
      this.stage.resize(width, height);
      Object.values(this.layers).forEach((layer) => layer.setFrame(0, 0, width, height));
      this.stage.layoutTree();
      this.stage.forEach((node) => {
        if (node.onScreenResize) node.onScreenResize(this.systemInfo);
      });
      if (this.sharedCanvas) {
        this.sharedCanvas.width = backingWidth;
        this.sharedCanvas.height = backingHeight;
        if (this.sharedContext.postMessage) {
          this.sharedContext.postMessage({
            command: "resize",
            pixelRatio,
            width: backingWidth,
            height: backingHeight
          });
        }
      }
      this.render();
    }
    tick(time = Date.now()) {
      if (!this.running) return;
      const elapsed = this.lastTime ? time - this.lastTime : this.minFrameTime;
      if (!this.minFrameTime || elapsed >= this.minFrameTime - 1) {
        this.lastTime = time;
        const dt2 = elapsed / 1e3;
        this.stage.update(dt2);
        this.stage.layoutTree();
        if (this.autoRender || this.stage.renderRequested) this.render();
      }
      this.frameId = this.platform.requestAnimationFrame(this.tick);
    }
    render() {
      applyCanvasScale(this.ctx, this.pixelRatio);
      this.stage.renderStage(this.ctx);
    }
    handleShow(event) {
      this.emit("show", event);
      this.resize();
    }
    handleHide(event) {
      this.emit("hide", event);
    }
    enableShare(callback) {
      this.shareCallback = callback;
      if (this.platform.setShare) this.platform.setShare(callback);
    }
    share(options = null) {
      const payload = options || (this.shareCallback ? this.shareCallback() : null);
      if (payload && this.platform.share) this.platform.share(payload);
    }
    request(options) {
      return this.platform.request ? this.platform.request(options) : Promise.reject(new Error("platform.request is not available"));
    }
    createUserInfoButton(options) {
      return this.platform.createUserInfoButton ? this.platform.createUserInfoButton(options) : null;
    }
    getSetting(options = {}) {
      return this.platform.getSetting ? this.platform.getSetting(options) : Promise.reject(new Error("platform.getSetting is not available"));
    }
    getUserInfo(options = {}) {
      const {
        container = null,
        forceShowButton = false,
        onShowButton = null,
        type = "text",
        value = "\u767B\u5F55",
        style = null,
        userInfoOptions = {}
      } = options;
      return this.getSetting().then((setting) => {
        const authorized = setting.authSetting && setting.authSetting["scope.userInfo"];
        if (!forceShowButton && authorized && this.platform.getUserInfo) {
          return this.platform.getUserInfo(userInfoOptions).then((userInfo) => ({ setting, userInfo }));
        }
        if (!container) {
          if (!this.platform.getUserInfo) {
            return Promise.reject(new Error("platform.getUserInfo is not available"));
          }
          return this.platform.getUserInfo(userInfoOptions).then((userInfo) => ({ setting, userInfo }));
        }
        return new Promise((resolve, reject) => {
          const buttonNode = container.addChild(new LoginButton(this.platform, style || {}, type, value));
          const nativeButton = buttonNode.button;
          if (onShowButton) onShowButton(buttonNode, nativeButton);
          if (!nativeButton) {
            container.removeChild(buttonNode);
            reject(new Error("platform.createUserInfoButton is not available"));
            return;
          }
          nativeButton.onTap((userInfo) => {
            if (nativeButton.offTap) nativeButton.offTap();
            if (nativeButton.destroy) nativeButton.destroy();
            container.removeChild(buttonNode);
            resolve({ setting, userInfo });
          });
        });
      });
    }
    platformLogin(options = {}) {
      return this.platform.login ? this.platform.login(options) : Promise.reject(new Error("platform.login is not available"));
    }
    login(options = {}) {
      const {
        container = null,
        forceShowButton = false,
        onShowButton = null,
        onButtonTap = null,
        requestOptions = null,
        type = "text",
        value = "\u767B\u5F55",
        style = null,
        userInfoOptions = {},
        loginOptions = {}
      } = options;
      return this.getUserInfo({
        container,
        forceShowButton,
        onShowButton,
        type,
        value,
        style,
        userInfoOptions
      }).then(({ setting, userInfo }) => {
        if (onButtonTap) onButtonTap(setting, userInfo);
        return this.platformLogin(loginOptions).then((loginInfo) => {
          const requestConfig = typeof requestOptions === "function" ? requestOptions(setting, userInfo, loginInfo) : requestOptions;
          if (requestConfig && requestConfig.url) {
            return this.request(requestConfig).then((response) => ({ setting, userInfo, loginInfo, response })).catch((response) => ({ setting, userInfo, loginInfo, response }));
          }
          return { setting, userInfo, loginInfo, response: null };
        });
      });
    }
    getTouchPoint() {
      return this.input.getTouchPoint();
    }
    getTouchMoveVector() {
      return this.input.getTouchMoveVector();
    }
    lerp(a2, b2, t4) {
      const diff = b2 - a2;
      if (Math.abs(diff) < 1e-5) return b2;
      return a2 + diff * Math.max(0, Math.min(1, t4));
    }
    destroy() {
      this.stop();
      this.input.destroy();
      if (this.unbindShow) this.unbindShow();
      if (this.unbindHide) this.unbindHide();
      this.stage.removeChildren();
      this.platform.destroy ? this.platform.destroy() : noop();
    }
  };

  // ../../packages/mc2d/src/platform/wechat-adapter.js
  function fallbackRequestAnimationFrame(handler) {
    return setTimeout(() => handler(Date.now()), 16);
  }
  function fallbackCancelAnimationFrame(id2) {
    clearTimeout(id2);
  }
  var WeChatAdapter = {
    onShow(handler) {
      if (!wx.onShow) return null;
      wx.onShow(handler);
      return wx.offShow ? () => wx.offShow(handler) : null;
    },
    onHide(handler) {
      if (!wx.onHide) return null;
      wx.onHide(handler);
      return wx.offHide ? () => wx.offHide(handler) : null;
    },
    setFPS(fps) {
      if (wx.setPreferredFramesPerSecond) wx.setPreferredFramesPerSecond(fps);
    },
    getSystemInfo() {
      const info = wx.getSystemInfoSync();
      const { windowWidth, windowHeight, safeArea } = info;
      info.safeAreaTop = safeArea ? safeArea.top : windowHeight / windowWidth > 2 ? 50 : 0;
      return info;
    },
    createCanvas() {
      return wx.createCanvas();
    },
    createImage() {
      return wx.createImage ? wx.createImage() : new Image();
    },
    createAudio() {
      return wx.createInnerAudioContext ? wx.createInnerAudioContext() : new Audio();
    },
    getOpenDataContext() {
      return wx.getOpenDataContext ? wx.getOpenDataContext() : null;
    },
    createUserInfoButton(options) {
      return wx.createUserInfoButton ? wx.createUserInfoButton(options) : null;
    },
    share(options) {
      if (wx.shareAppMessage) wx.shareAppMessage(options);
    },
    setShare(handler) {
      if (wx.showShareMenu) wx.showShareMenu({ withShareTicket: true, menus: ["shareAppMessage", "shareTimeline"] });
      if (wx.onShareAppMessage) wx.onShareAppMessage(() => handler());
    },
    request(options) {
      if (!wx.request) return Promise.reject(new Error("wx.request is not available"));
      return new Promise((resolve, reject) => {
        wx.request(Object.assign({ timeout: 5e3 }, options, {
          success: (result) => {
            if (options && options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options && options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options && options.complete) options.complete(result);
          }
        }));
      });
    },
    getSetting(options = {}) {
      if (!wx.getSetting) return Promise.reject(new Error("wx.getSetting is not available"));
      return new Promise((resolve, reject) => {
        wx.getSetting(Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          }
        }));
      });
    },
    getUserInfo(options = {}) {
      if (!wx.getUserInfo) return Promise.reject(new Error("wx.getUserInfo is not available"));
      return new Promise((resolve, reject) => {
        wx.getUserInfo(Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          }
        }));
      });
    },
    login(options = {}) {
      if (!wx.login) return Promise.reject(new Error("wx.login is not available"));
      return new Promise((resolve, reject) => {
        wx.login(Object.assign({}, options, {
          success: (result) => {
            if (options.success) options.success(result);
            resolve(result);
          },
          fail: (error) => {
            if (options.fail) options.fail(error);
            reject(error);
          },
          complete: (result) => {
            if (options.complete) options.complete(result);
          }
        }));
      });
    },
    requestAnimationFrame(handler) {
      const raf = wx.requestAnimationFrame || globalThis.requestAnimationFrame || (typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null) || fallbackRequestAnimationFrame;
      return raf(handler);
    },
    cancelAnimationFrame(id2) {
      const caf = wx.cancelAnimationFrame || globalThis.cancelAnimationFrame || (typeof cancelAnimationFrame !== "undefined" ? cancelAnimationFrame : null) || fallbackCancelAnimationFrame;
      caf(id2);
    },
    bindTouch(canvas, handlers) {
      if (canvas.addEventListener) {
        canvas.addEventListener("touchstart", handlers.start);
        canvas.addEventListener("touchmove", handlers.move);
        canvas.addEventListener("touchend", handlers.end);
        canvas.addEventListener("touchcancel", handlers.cancel);
        return () => {
          canvas.removeEventListener("touchstart", handlers.start);
          canvas.removeEventListener("touchmove", handlers.move);
          canvas.removeEventListener("touchend", handlers.end);
          canvas.removeEventListener("touchcancel", handlers.cancel);
        };
      }
      wx.onTouchStart(handlers.start);
      wx.onTouchMove(handlers.move);
      wx.onTouchEnd(handlers.end);
      if (wx.onTouchCancel) wx.onTouchCancel(handlers.cancel);
      return () => {
        if (wx.offTouchStart) wx.offTouchStart(handlers.start);
        if (wx.offTouchMove) wx.offTouchMove(handlers.move);
        if (wx.offTouchEnd) wx.offTouchEnd(handlers.end);
        if (wx.offTouchCancel) wx.offTouchCancel(handlers.cancel);
      };
    },
    getStorage(key) {
      try {
        return wx.getStorageSync(key);
      } catch (e2) {
        return null;
      }
    },
    setStorage(key, value) {
      try {
        wx.setStorageSync(key, value);
      } catch (e2) {
      }
    },
    removeStorage(key) {
      try {
        wx.removeStorageSync(key);
      } catch (e2) {
      }
    }
  };
  var wechat_adapter_default = WeChatAdapter;

  // ../../packages/mc2d/src/display/graphics/shape.js
  var Shape = class extends Graphic {
    constructor(options = {}) {
      super(Object.assign({
        shape: "rect",
        radius: 0,
        fillStyle: "#fff",
        strokeStyle: "",
        lineWidth: 1
      }, options));
    }
    drawRoundRect(ctx, width, height, radius) {
      const r2 = Math.max(0, Math.min(radius, width / 2, height / 2));
      ctx.beginPath();
      ctx.moveTo(r2, 0);
      ctx.lineTo(width - r2, 0);
      ctx.arcTo(width, 0, width, r2, r2);
      ctx.lineTo(width, height - r2);
      ctx.arcTo(width, height, width - r2, height, r2);
      ctx.lineTo(r2, height);
      ctx.arcTo(0, height, 0, height - r2, r2);
      ctx.lineTo(0, r2);
      ctx.arcTo(0, 0, r2, 0, r2);
      ctx.closePath();
    }
    draw(ctx) {
      const { shape, fillStyle, strokeStyle, lineWidth, radius } = this.options;
      ctx.beginPath();
      if (shape === "circle") {
        const r2 = Math.min(this.width, this.height) / 2;
        ctx.arc(this.width / 2, this.height / 2, r2, 0, Math.PI * 2);
      } else if (shape === "ellipse") {
        ctx.ellipse(this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      } else if (radius > 0 || shape === "roundRect") {
        this.drawRoundRect(ctx, this.width, this.height, radius || this.options.roundRadius || 6);
      } else {
        ctx.rect(0, 0, this.width, this.height);
      }
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle && lineWidth > 0) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    }
  };

  // ../../packages/mc2d/src/display/graphics/text.js
  var Text = class extends Graphic {
    constructor(text = "", options = {}) {
      super(Object.assign({
        fillStyle: "#fff",
        fontSize: 14,
        fontFamily: "Arial",
        textAlign: "center",
        textBaseline: "middle",
        lineHeight: 0,
        maxLines: 0,
        ellipsis: false,
        strokeStyle: "",
        lineWidth: 1
      }, options));
      this._text = String(text);
    }
    get text() {
      return this._text;
    }
    set text(value) {
      const next = String(value);
      if (next === this._text) return;
      this._text = next;
      this.invalidatePaint();
    }
    draw(ctx) {
      const {
        fillStyle,
        fontSize,
        fontFamily,
        textAlign,
        textBaseline,
        lineHeight,
        maxLines,
        ellipsis,
        strokeStyle,
        lineWidth
      } = this.options;
      let lines = this._text.split("\n");
      if (maxLines > 0 && lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        if (ellipsis) lines[lines.length - 1] += "...";
      }
      const lh2 = lineHeight || fontSize * 1.25;
      const totalHeight = lh2 * lines.length;
      let y2 = this.height / 2 - totalHeight / 2 + lh2 / 2;
      let x2 = this.width / 2;
      if (textAlign === "left") x2 = 0;
      else if (textAlign === "right") x2 = this.width;
      ctx.fillStyle = fillStyle;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      lines.forEach((line) => {
        if (strokeStyle && lineWidth > 0) {
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineWidth;
          ctx.strokeText(line, x2, y2);
        }
        ctx.fillText(line, x2, y2);
        y2 += lh2;
      });
    }
  };

  // ../../packages/mc2d/src/display/graphics/button.js
  var Button = class extends Container {
    constructor(label = "", options = {}) {
      super();
      this.touchEnabled = true;
      const normalBackground = Object.assign({
        fillStyle: "#2f7df6",
        radius: 6
      }, options.background);
      const normalLabel = Object.assign({
        fillStyle: "#fff",
        fontSize: 16
      }, options.label);
      this.styles = {
        normal: options.normal || {
          background: normalBackground,
          label: normalLabel
        },
        pressed: options.pressed || null,
        disabled: options.disabled || null
      };
      this.state = "normal";
      this.background = this.addChild(new Shape(normalBackground));
      this.labelView = this.addChild(new Text(label, normalLabel));
      this.on("pointerdown", () => this.setState("pressed"));
      this.on("pointerup", () => this.setState("normal"));
      this.on("pointercancel", () => this.setState("normal"));
    }
    get label() {
      return this.labelView.text;
    }
    set label(value) {
      this.labelView.text = value;
    }
    setState(state) {
      if (state === "pressed" && !this.styles.pressed) state = "normal";
      if (state === "disabled") this.touchEnabled = false;
      else if (this.state === "disabled") this.touchEnabled = true;
      this.state = state;
      const style = this.styles[state];
      if (style && style.background) this.background.setOptions(style.background);
      if (style && style.label) this.labelView.setOptions(style.label);
      return this;
    }
    layoutSelf(parentBounds, parentWorldX = 0, parentWorldY = 0) {
      this.measure(parentBounds);
      this.updateWorldBounds(parentWorldX, parentWorldY);
      this.background.setFrame(0, 0, this.width, this.height);
      this.labelView.setFrame(0, 0, this.width, this.height);
      this.children.forEach((child) => {
        child.layoutSelf(this.worldBounds, this.worldBounds.x, this.worldBounds.y);
      });
      this.dirtyLayout = false;
    }
  };

  // ../../packages/mc2d/src/display/layout/unit.js
  var Unit = class _Unit {
    constructor(value = 0, percent = false, valid = true) {
      this.value = value;
      this.percent = percent;
      this.valid = valid;
    }
    static parse(value, fallback = 0) {
      if (value === null || value === void 0 || value === "") return new _Unit(fallback, false, false);
      if (typeof value === "string" && value.indexOf("%") >= 0) {
        return new _Unit(parseFloat(value) / 100, true, !isNaN(parseFloat(value)));
      }
      const number2 = Number(value);
      return new _Unit(number2, false, !isNaN(number2));
    }
    resolve(total, fallback = 0) {
      if (!this.valid) return fallback;
      return this.percent ? total * this.value : this.value;
    }
  };

  // ../../packages/mc2d/src/display/layout/anchor-layout.js
  var ANCHORS = {
    "top-left": [0, 0],
    top: [0.5, 0],
    "top-center": [0.5, 0],
    "top-right": [1, 0],
    left: [0, 0.5],
    "middle-left": [0, 0.5],
    center: [0.5, 0.5],
    middle: [0.5, 0.5],
    right: [1, 0.5],
    "middle-right": [1, 0.5],
    "bottom-left": [0, 1],
    bottom: [0.5, 1],
    "bottom-center": [0.5, 1],
    "bottom-right": [1, 1]
  };
  var AnchorLayout = class {
    constructor(options = {}) {
      this.anchor = options.anchor || "top-left";
      this.x = Unit.parse(options.x || 0);
      this.y = Unit.parse(options.y || 0);
      this.width = Unit.parse(options.width === void 0 ? "100%" : options.width);
      this.height = Unit.parse(options.height === void 0 ? "100%" : options.height);
    }
    applyTo(target2, parentBounds) {
      const anchor2 = ANCHORS[this.anchor] || ANCHORS.center;
      const width = this.width.resolve(parentBounds.width, target2.width);
      const height = this.height.resolve(parentBounds.height, target2.height);
      const offsetX = this.x.resolve(parentBounds.width);
      const offsetY = this.y.resolve(parentBounds.height);
      target2.x = (parentBounds.width - width) * anchor2[0] + offsetX;
      target2.y = (parentBounds.height - height) * anchor2[1] + offsetY;
      target2.width = width;
      target2.height = height;
    }
  };

  // ../../packages/mc2d/src/display/layout/index.js
  function anchor(options) {
    return new AnchorLayout(options);
  }

  // ../../packages/mc2d/src/index.js
  function createWeChatApp(options = {}) {
    const platform = options.platform || wechat_adapter_default;
    const mainCanvas = options.canvas || globalThis.canvas || platform.createCanvas();
    return new Mc2dApp(Object.assign({}, options, {
      platform,
      canvas: mainCanvas
    }));
  }

  // src/index.js
  var import_polyfill = __toESM(require_browser_polyfill(), 1);
  var import_url_polyfill = __toESM(require_url_polyfill(), 1);

  // src/config.js
  var GAME_ID = "mahjong";
  var SERVER_BASE_URL = "http://192.168.2.191:2567";

  // src/auth/wechat-login.js
  var AUTH_STORAGE_KEY = "wxMahjong.authSession";
  function getCachedAuthSession(app2, options = {}) {
    try {
      const gameId = getGameId(options);
      const session = app2.platform.getStorage ? app2.platform.getStorage(AUTH_STORAGE_KEY) : null;
      if (session && session.gameId === gameId && session.token && session.user) return session;
    } catch (error) {
    }
    return null;
  }
  function clearCachedAuthSession(app2) {
    try {
      if (app2.platform.removeStorage) {
        app2.platform.removeStorage(AUTH_STORAGE_KEY);
      }
    } catch (error) {
    }
  }
  async function loginWechatMiniGame(app2, options = {}) {
    const gameId = getGameId(options);
    const userProfile = normalizeUserProfile(options.userInfo);
    const loginInfo = await app2.platformLogin();
    if (!loginInfo || !loginInfo.code) {
      throw new Error("wx.login did not return a code.");
    }
    const loginUrl = `${getServerBaseUrl(options)}/auth/wechat/minigame/login`;
    console.info("[wx-mahjong] wechat login request", {
      gameId,
      url: loginUrl,
      hasAvatarUrl: Boolean(userProfile.avatarUrl)
    });
    let response = null;
    try {
      response = await app2.request({
        url: loginUrl,
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: {
          gameId,
          code: loginInfo.code,
          name: options.name || userProfile.nickName || "player",
          avatarUrl: userProfile.avatarUrl || ""
        }
      });
    } catch (error) {
      console.warn("[wx-mahjong] wechat login request failed", {
        gameId,
        url: loginUrl,
        errMsg: error && error.errMsg,
        errno: error && error.errno
      });
      throw error;
    }
    const data = response && response.data;
    if (!response || response.statusCode < 200 || response.statusCode >= 300 || !data || !data.ok || !data.token) {
      throw new Error(data && data.message || "Wechat login request failed.");
    }
    const session = {
      gameId,
      token: data.token,
      user: data.user
    };
    if (app2.platform.setStorage) {
      app2.platform.setStorage(AUTH_STORAGE_KEY, session);
    }
    return session;
  }
  function getServerBaseUrl(options) {
    const value = options.serverBaseUrl || globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL;
    return String(value).replace(/\/+$/, "");
  }
  function getGameId(options) {
    return String(options.gameId || globalThis.__WX_MAHJONG_GAME_ID__ || GAME_ID);
  }
  function normalizeUserProfile(value) {
    const userInfo = value && value.userInfo ? value.userInfo : value;
    return {
      nickName: userInfo && userInfo.nickName || "",
      avatarUrl: userInfo && userInfo.avatarUrl || ""
    };
  }

  // src/utils/prompts.js
  function requestJoinInfo() {
    if (globalThis.wx && globalThis.wx.showModal) {
      return new Promise((resolve) => {
        globalThis.wx.showModal({
          title: "\u52A0\u5165\u623F\u95F4",
          placeholderText: "\u623F\u95F4\u53F7,\u5BC6\u7801\u53EF\u9009",
          editable: true,
          success(result) {
            resolve(result && result.confirm ? parseJoinInfo(result.content) : { roomId: "", password: "" });
          },
          fail() {
            resolve({ roomId: "", password: "" });
          }
        });
      });
    }
    if (globalThis.prompt) {
      return Promise.resolve(parseJoinInfo(globalThis.prompt("\u623F\u95F4\u53F7,\u5BC6\u7801\u53EF\u9009") || ""));
    }
    return Promise.resolve({ roomId: "", password: "" });
  }
  function parseJoinInfo(value) {
    const parts = String(value || "").split(",").map((item) => item.trim());
    return {
      roomId: parts[0] || "",
      password: parts[1] || ""
    };
  }

  // src/views/login-view.js
  var LoginView = class extends Container {
    constructor(app2, options = {}) {
      super();
      this.app = app2;
      this.onLogin = options.onLogin || null;
      this.initialMessage = options.message || "\u51C6\u5907\u767B\u5F55";
      this.status = "idle";
      this.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.background = this.addChild(new Shape({ fillStyle: "#173b32" }));
      this.background.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.title = this.addChild(
        new Text("\u7EA2\u4E2D\u9EBB\u5C06", {
          fillStyle: "#f9f2dc",
          fontSize: 28,
          textAlign: "center"
        })
      );
      this.title.setLayout(anchor({ anchor: "top", y: 120, width: 240, height: 44 }));
      this.statusText = this.addChild(
        new Text(this.initialMessage, {
          fillStyle: "#dce8de",
          fontSize: 14,
          lineHeight: 20,
          maxLines: 2
        })
      );
      this.statusText.setLayout(anchor({ anchor: "top", y: 176, width: 260, height: 48 }));
      this.retryButton = this.addChild(
        new Button("\u91CD\u8BD5", {
          background: { fillStyle: "#2f7df6", radius: 6 },
          label: { fillStyle: "#fff", fontSize: 16 }
        })
      );
      this.retryButton.setLayout(anchor({ anchor: "top", y: 246, width: 150, height: 42 }));
      this.retryButton.visible = false;
      this.retryButton.on("tap", () => this.startLogin(true));
    }
    async startLogin(force = false) {
      if (this.status === "loading") return;
      const cachedSession = !force ? getCachedAuthSession(this.app) : null;
      if (cachedSession) {
        this.finishLogin(cachedSession);
        return;
      }
      this.setStatus("waiting");
      try {
        const { userInfo } = await this.app.getUserInfo({
          container: this,
          forceShowButton: true,
          value: "\u5FAE\u4FE1\u767B\u5F55",
          style: {
            backgroundColor: "#07c160",
            color: "#ffffff",
            borderRadius: 6,
            fontSize: 16,
            lineHeight: 44
          },
          onShowButton: (button) => {
            button.setLayout(anchor({ anchor: "top", y: 246, width: 150, height: 44 }));
          }
        });
        this.setStatus("loading");
        const authSession = await loginWechatMiniGame(this.app, { userInfo });
        this.finishLogin(authSession);
      } catch (error) {
        this.setStatus("failed", error);
      }
    }
    finishLogin(authSession) {
      this.setStatus("ready");
      if (this.onLogin) this.onLogin(authSession);
    }
    setStatus(status, error = null) {
      this.status = status;
      this.retryButton.visible = status === "failed";
      if (status === "waiting") this.statusText.text = "\u8BF7\u5148\u5B8C\u6210\u5FAE\u4FE1\u767B\u5F55";
      else if (status === "loading") this.statusText.text = "\u5FAE\u4FE1\u767B\u5F55\u4E2D...";
      else if (status === "ready") this.statusText.text = "\u767B\u5F55\u6210\u529F";
      else if (status === "failed") this.statusText.text = "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5";
      else this.statusText.text = this.initialMessage;
      if (error) console.warn("[wx-mahjong] wechat login failed", error);
      this.invalidatePaint();
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/legacy.mjs
  if (!ArrayBuffer.isView) {
    ArrayBuffer.isView = (a2) => {
      return a2 !== null && typeof a2 === "object" && a2.buffer instanceof ArrayBuffer;
    };
  }
  if (typeof globalThis === "undefined" && typeof window !== "undefined") {
    window["globalThis"] = window;
  }
  if (typeof FormData === "undefined") {
    globalThis["FormData"] = class {
    };
  }

  // ../../node_modules/.pnpm/@colyseus+shared-types@0.17.6/node_modules/@colyseus/shared-types/build/Protocol.mjs
  var Protocol = {
    // Room-related (10~19)
    JOIN_ROOM: 10,
    ERROR: 11,
    LEAVE_ROOM: 12,
    ROOM_DATA: 13,
    ROOM_STATE: 14,
    ROOM_STATE_PATCH: 15,
    ROOM_DATA_SCHEMA: 16,
    // DEPRECATED: used to send schema instances via room.send()
    ROOM_DATA_BYTES: 17,
    PING: 18
  };
  var CloseCode = {
    NORMAL_CLOSURE: 1e3,
    GOING_AWAY: 1001,
    NO_STATUS_RECEIVED: 1005,
    ABNORMAL_CLOSURE: 1006,
    CONSENTED: 4e3,
    SERVER_SHUTDOWN: 4001,
    WITH_ERROR: 4002,
    FAILED_TO_RECONNECT: 4003,
    MAY_TRY_RECONNECT: 4010
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/errors/Errors.mjs
  var ServerError = class extends Error {
    constructor(code, message, opts) {
      super(message);
      __publicField(this, "code");
      __publicField(this, "headers");
      __publicField(this, "status");
      __publicField(this, "response");
      __publicField(this, "data");
      this.name = "ServerError";
      this.code = code;
      if (opts) {
        this.headers = opts.headers;
        this.status = opts.status;
        this.response = opts.response;
        this.data = opts.data;
      }
    }
  };
  var MatchMakeError = class _MatchMakeError extends Error {
    constructor(message, code) {
      super(message);
      __publicField(this, "code");
      this.code = code;
      this.name = "MatchMakeError";
      Object.setPrototypeOf(this, _MatchMakeError.prototype);
    }
  };

  // ../../node_modules/.pnpm/@colyseus+schema@4.0.26_typescript@6.0.3/node_modules/@colyseus/schema/build/index.mjs
  var SWITCH_TO_STRUCTURE = 255;
  var TYPE_ID = 213;
  var OPERATION;
  (function(OPERATION2) {
    OPERATION2[OPERATION2["ADD"] = 128] = "ADD";
    OPERATION2[OPERATION2["REPLACE"] = 0] = "REPLACE";
    OPERATION2[OPERATION2["DELETE"] = 64] = "DELETE";
    OPERATION2[OPERATION2["DELETE_AND_MOVE"] = 96] = "DELETE_AND_MOVE";
    OPERATION2[OPERATION2["MOVE_AND_ADD"] = 160] = "MOVE_AND_ADD";
    OPERATION2[OPERATION2["DELETE_AND_ADD"] = 192] = "DELETE_AND_ADD";
    OPERATION2[OPERATION2["CLEAR"] = 10] = "CLEAR";
    OPERATION2[OPERATION2["REVERSE"] = 15] = "REVERSE";
    OPERATION2[OPERATION2["MOVE"] = 32] = "MOVE";
    OPERATION2[OPERATION2["DELETE_BY_REFID"] = 33] = "DELETE_BY_REFID";
    OPERATION2[OPERATION2["ADD_BY_REFID"] = 129] = "ADD_BY_REFID";
  })(OPERATION || (OPERATION = {}));
  Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol.for("Symbol.metadata"));
  var $refId = "~refId";
  var $track = "~track";
  var $encoder = "~encoder";
  var $decoder = "~decoder";
  var $filter = "~filter";
  var $getByIndex = "~getByIndex";
  var $deleteByIndex = "~deleteByIndex";
  var $changes = "~changes";
  var $childType = "~childType";
  var $onEncodeEnd = "~onEncodeEnd";
  var $onDecodeEnd = "~onDecodeEnd";
  var $descriptors = "~descriptors";
  var $numFields = "~__numFields";
  var $refTypeFieldIndexes = "~__refTypeFieldIndexes";
  var $viewFieldIndexes = "~__viewFieldIndexes";
  var $fieldIndexesByViewTag = "$__fieldIndexesByViewTag";
  var textEncoder;
  try {
    textEncoder = new TextEncoder();
  } catch (e2) {
  }
  var _convoBuffer$1 = new ArrayBuffer(8);
  var _int32$1 = new Int32Array(_convoBuffer$1);
  var _float32$1 = new Float32Array(_convoBuffer$1);
  var _float64$1 = new Float64Array(_convoBuffer$1);
  var _int64$1 = new BigInt64Array(_convoBuffer$1);
  var hasBufferByteLength = typeof Buffer !== "undefined" && Buffer.byteLength;
  var utf8Length = hasBufferByteLength ? Buffer.byteLength : function(str, _2) {
    var c2 = 0, length = 0;
    for (var i2 = 0, l2 = str.length; i2 < l2; i2++) {
      c2 = str.charCodeAt(i2);
      if (c2 < 128) {
        length += 1;
      } else if (c2 < 2048) {
        length += 2;
      } else if (c2 < 55296 || c2 >= 57344) {
        length += 3;
      } else {
        i2++;
        length += 4;
      }
    }
    return length;
  };
  function utf8Write(view2, str, it2) {
    var c2 = 0;
    for (var i2 = 0, l2 = str.length; i2 < l2; i2++) {
      c2 = str.charCodeAt(i2);
      if (c2 < 128) {
        view2[it2.offset++] = c2;
      } else if (c2 < 2048) {
        view2[it2.offset] = 192 | c2 >> 6;
        view2[it2.offset + 1] = 128 | c2 & 63;
        it2.offset += 2;
      } else if (c2 < 55296 || c2 >= 57344) {
        view2[it2.offset] = 224 | c2 >> 12;
        view2[it2.offset + 1] = 128 | c2 >> 6 & 63;
        view2[it2.offset + 2] = 128 | c2 & 63;
        it2.offset += 3;
      } else {
        i2++;
        c2 = 65536 + ((c2 & 1023) << 10 | str.charCodeAt(i2) & 1023);
        view2[it2.offset] = 240 | c2 >> 18;
        view2[it2.offset + 1] = 128 | c2 >> 12 & 63;
        view2[it2.offset + 2] = 128 | c2 >> 6 & 63;
        view2[it2.offset + 3] = 128 | c2 & 63;
        it2.offset += 4;
      }
    }
  }
  function int8$1(bytes, value, it2) {
    bytes[it2.offset++] = value & 255;
  }
  function uint8$1(bytes, value, it2) {
    bytes[it2.offset++] = value & 255;
  }
  function int16$1(bytes, value, it2) {
    bytes[it2.offset++] = value & 255;
    bytes[it2.offset++] = value >> 8 & 255;
  }
  function uint16$1(bytes, value, it2) {
    bytes[it2.offset++] = value & 255;
    bytes[it2.offset++] = value >> 8 & 255;
  }
  function int32$1(bytes, value, it2) {
    bytes[it2.offset++] = value & 255;
    bytes[it2.offset++] = value >> 8 & 255;
    bytes[it2.offset++] = value >> 16 & 255;
    bytes[it2.offset++] = value >> 24 & 255;
  }
  function uint32$1(bytes, value, it2) {
    const b4 = value >> 24;
    const b3 = value >> 16;
    const b2 = value >> 8;
    const b1 = value;
    bytes[it2.offset++] = b1 & 255;
    bytes[it2.offset++] = b2 & 255;
    bytes[it2.offset++] = b3 & 255;
    bytes[it2.offset++] = b4 & 255;
  }
  function int64$1(bytes, value, it2) {
    const high = Math.floor(value / Math.pow(2, 32));
    const low = value >>> 0;
    uint32$1(bytes, low, it2);
    uint32$1(bytes, high, it2);
  }
  function uint64$1(bytes, value, it2) {
    const high = value / Math.pow(2, 32) >> 0;
    const low = value >>> 0;
    uint32$1(bytes, low, it2);
    uint32$1(bytes, high, it2);
  }
  function bigint64$1(bytes, value, it2) {
    _int64$1[0] = BigInt.asIntN(64, value);
    int32$1(bytes, _int32$1[0], it2);
    int32$1(bytes, _int32$1[1], it2);
  }
  function biguint64$1(bytes, value, it2) {
    _int64$1[0] = BigInt.asIntN(64, value);
    int32$1(bytes, _int32$1[0], it2);
    int32$1(bytes, _int32$1[1], it2);
  }
  function float32$1(bytes, value, it2) {
    _float32$1[0] = value;
    int32$1(bytes, _int32$1[0], it2);
  }
  function float64$1(bytes, value, it2) {
    _float64$1[0] = value;
    int32$1(bytes, _int32$1[0], it2);
    int32$1(bytes, _int32$1[1], it2);
  }
  function boolean$1(bytes, value, it2) {
    bytes[it2.offset++] = value ? 1 : 0;
  }
  function string$1(bytes, value, it2) {
    if (!value) {
      value = "";
    }
    let length = utf8Length(value, "utf8");
    let size = 0;
    if (length < 32) {
      bytes[it2.offset++] = length | 160;
      size = 1;
    } else if (length < 256) {
      bytes[it2.offset++] = 217;
      bytes[it2.offset++] = length;
      size = 2;
    } else if (length < 65536) {
      bytes[it2.offset++] = 218;
      uint16$1(bytes, length, it2);
      size = 3;
    } else if (length < 4294967296) {
      bytes[it2.offset++] = 219;
      uint32$1(bytes, length, it2);
      size = 5;
    } else {
      throw new Error("String too long");
    }
    utf8Write(bytes, value, it2);
    return size + length;
  }
  function number$1(bytes, value, it2) {
    if (isNaN(value)) {
      return number$1(bytes, 0, it2);
    } else if (!isFinite(value)) {
      return number$1(bytes, value > 0 ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER, it2);
    } else if (value !== (value | 0)) {
      if (Math.abs(value) <= 34028235e31) {
        _float32$1[0] = value;
        if (Math.abs(Math.abs(_float32$1[0]) - Math.abs(value)) < 1e-4) {
          bytes[it2.offset++] = 202;
          float32$1(bytes, value, it2);
          return 5;
        }
      }
      bytes[it2.offset++] = 203;
      float64$1(bytes, value, it2);
      return 9;
    }
    if (value >= 0) {
      if (value < 128) {
        bytes[it2.offset++] = value & 255;
        return 1;
      }
      if (value < 256) {
        bytes[it2.offset++] = 204;
        bytes[it2.offset++] = value & 255;
        return 2;
      }
      if (value < 65536) {
        bytes[it2.offset++] = 205;
        uint16$1(bytes, value, it2);
        return 3;
      }
      if (value < 4294967296) {
        bytes[it2.offset++] = 206;
        uint32$1(bytes, value, it2);
        return 5;
      }
      bytes[it2.offset++] = 207;
      uint64$1(bytes, value, it2);
      return 9;
    } else {
      if (value >= -32) {
        bytes[it2.offset++] = 224 | value + 32;
        return 1;
      }
      if (value >= -128) {
        bytes[it2.offset++] = 208;
        int8$1(bytes, value, it2);
        return 2;
      }
      if (value >= -32768) {
        bytes[it2.offset++] = 209;
        int16$1(bytes, value, it2);
        return 3;
      }
      if (value >= -2147483648) {
        bytes[it2.offset++] = 210;
        int32$1(bytes, value, it2);
        return 5;
      }
      bytes[it2.offset++] = 211;
      int64$1(bytes, value, it2);
      return 9;
    }
  }
  var encode = {
    int8: int8$1,
    uint8: uint8$1,
    int16: int16$1,
    uint16: uint16$1,
    int32: int32$1,
    uint32: uint32$1,
    int64: int64$1,
    uint64: uint64$1,
    bigint64: bigint64$1,
    biguint64: biguint64$1,
    float32: float32$1,
    float64: float64$1,
    boolean: boolean$1,
    string: string$1,
    number: number$1,
    utf8Write,
    utf8Length
  };
  var _convoBuffer = new ArrayBuffer(8);
  var _int32 = new Int32Array(_convoBuffer);
  var _float32 = new Float32Array(_convoBuffer);
  var _float64 = new Float64Array(_convoBuffer);
  var _uint64 = new BigUint64Array(_convoBuffer);
  var _int64 = new BigInt64Array(_convoBuffer);
  function utf8Read(bytes, it2, length) {
    if (length > bytes.length - it2.offset) {
      length = bytes.length - it2.offset;
    }
    var string2 = "", chr = 0;
    for (var i2 = it2.offset, end = it2.offset + length; i2 < end; i2++) {
      var byte = bytes[i2];
      if ((byte & 128) === 0) {
        string2 += String.fromCharCode(byte);
        continue;
      }
      if ((byte & 224) === 192) {
        string2 += String.fromCharCode((byte & 31) << 6 | bytes[++i2] & 63);
        continue;
      }
      if ((byte & 240) === 224) {
        string2 += String.fromCharCode((byte & 15) << 12 | (bytes[++i2] & 63) << 6 | (bytes[++i2] & 63) << 0);
        continue;
      }
      if ((byte & 248) === 240) {
        chr = (byte & 7) << 18 | (bytes[++i2] & 63) << 12 | (bytes[++i2] & 63) << 6 | (bytes[++i2] & 63) << 0;
        if (chr >= 65536) {
          chr -= 65536;
          string2 += String.fromCharCode((chr >>> 10) + 55296, (chr & 1023) + 56320);
        } else {
          string2 += String.fromCharCode(chr);
        }
        continue;
      }
      console.error("decode.utf8Read(): Invalid byte " + byte + " at offset " + i2 + ". Skip to end of string: " + (it2.offset + length));
      break;
    }
    it2.offset += length;
    return string2;
  }
  function int8(bytes, it2) {
    return uint8(bytes, it2) << 24 >> 24;
  }
  function uint8(bytes, it2) {
    return bytes[it2.offset++];
  }
  function int16(bytes, it2) {
    return uint16(bytes, it2) << 16 >> 16;
  }
  function uint16(bytes, it2) {
    return bytes[it2.offset++] | bytes[it2.offset++] << 8;
  }
  function int32(bytes, it2) {
    return bytes[it2.offset++] | bytes[it2.offset++] << 8 | bytes[it2.offset++] << 16 | bytes[it2.offset++] << 24;
  }
  function uint32(bytes, it2) {
    return int32(bytes, it2) >>> 0;
  }
  function float32(bytes, it2) {
    _int32[0] = int32(bytes, it2);
    return _float32[0];
  }
  function float64(bytes, it2) {
    _int32[0] = int32(bytes, it2);
    _int32[1] = int32(bytes, it2);
    return _float64[0];
  }
  function int64(bytes, it2) {
    const low = uint32(bytes, it2);
    const high = int32(bytes, it2) * Math.pow(2, 32);
    return high + low;
  }
  function uint64(bytes, it2) {
    const low = uint32(bytes, it2);
    const high = uint32(bytes, it2) * Math.pow(2, 32);
    return high + low;
  }
  function bigint64(bytes, it2) {
    _int32[0] = int32(bytes, it2);
    _int32[1] = int32(bytes, it2);
    return _int64[0];
  }
  function biguint64(bytes, it2) {
    _int32[0] = int32(bytes, it2);
    _int32[1] = int32(bytes, it2);
    return _uint64[0];
  }
  function boolean(bytes, it2) {
    return uint8(bytes, it2) > 0;
  }
  function string(bytes, it2) {
    const prefix = bytes[it2.offset++];
    let length;
    if (prefix < 192) {
      length = prefix & 31;
    } else if (prefix === 217) {
      length = uint8(bytes, it2);
    } else if (prefix === 218) {
      length = uint16(bytes, it2);
    } else if (prefix === 219) {
      length = uint32(bytes, it2);
    }
    return utf8Read(bytes, it2, length);
  }
  function number(bytes, it2) {
    const prefix = bytes[it2.offset++];
    if (prefix < 128) {
      return prefix;
    } else if (prefix === 202) {
      return float32(bytes, it2);
    } else if (prefix === 203) {
      return float64(bytes, it2);
    } else if (prefix === 204) {
      return uint8(bytes, it2);
    } else if (prefix === 205) {
      return uint16(bytes, it2);
    } else if (prefix === 206) {
      return uint32(bytes, it2);
    } else if (prefix === 207) {
      return uint64(bytes, it2);
    } else if (prefix === 208) {
      return int8(bytes, it2);
    } else if (prefix === 209) {
      return int16(bytes, it2);
    } else if (prefix === 210) {
      return int32(bytes, it2);
    } else if (prefix === 211) {
      return int64(bytes, it2);
    } else if (prefix > 223) {
      return (255 - prefix + 1) * -1;
    }
  }
  function stringCheck(bytes, it2) {
    const prefix = bytes[it2.offset];
    return (
      // fixstr
      prefix < 192 && prefix > 160 || // str 8
      prefix === 217 || // str 16
      prefix === 218 || // str 32
      prefix === 219
    );
  }
  var decode = {
    utf8Read,
    int8,
    uint8,
    int16,
    uint16,
    int32,
    uint32,
    float32,
    float64,
    int64,
    uint64,
    bigint64,
    biguint64,
    boolean,
    string,
    number,
    stringCheck
  };
  var registeredTypes = {};
  var identifiers = /* @__PURE__ */ new Map();
  function registerType(identifier, definition) {
    if (definition.constructor) {
      identifiers.set(definition.constructor, identifier);
      registeredTypes[identifier] = definition;
    }
    if (definition.encode) {
      encode[identifier] = definition.encode;
    }
    if (definition.decode) {
      decode[identifier] = definition.decode;
    }
  }
  function getType(identifier) {
    return registeredTypes[identifier];
  }
  var _TypeContext = class _TypeContext {
    constructor(rootClass) {
      __publicField(this, "types", {});
      __publicField(this, "schemas", /* @__PURE__ */ new Map());
      __publicField(this, "hasFilters", false);
      __publicField(this, "parentFiltered", {});
      if (rootClass) {
        this.discoverTypes(rootClass);
      }
    }
    static register(target2) {
      const parent = Object.getPrototypeOf(target2);
      if (parent !== Schema) {
        let inherits = _TypeContext.inheritedTypes.get(parent);
        if (!inherits) {
          inherits = /* @__PURE__ */ new Set();
          _TypeContext.inheritedTypes.set(parent, inherits);
        }
        inherits.add(target2);
      }
    }
    static cache(rootClass) {
      let context = _TypeContext.cachedContexts.get(rootClass);
      if (!context) {
        context = new _TypeContext(rootClass);
        _TypeContext.cachedContexts.set(rootClass, context);
      }
      return context;
    }
    has(schema2) {
      return this.schemas.has(schema2);
    }
    get(typeid) {
      return this.types[typeid];
    }
    add(schema2, typeid = this.schemas.size) {
      if (this.schemas.has(schema2)) {
        return false;
      }
      this.types[typeid] = schema2;
      if (schema2[Symbol.metadata] === void 0) {
        Metadata.initialize(schema2);
      }
      this.schemas.set(schema2, typeid);
      return true;
    }
    getTypeId(klass) {
      return this.schemas.get(klass);
    }
    discoverTypes(klass, parentType, parentIndex, parentHasViewTag) {
      var _a7;
      if (parentHasViewTag) {
        this.registerFilteredByParent(klass, parentType, parentIndex);
      }
      if (!this.add(klass)) {
        return;
      }
      _TypeContext.inheritedTypes.get(klass)?.forEach((child) => {
        this.discoverTypes(child, parentType, parentIndex, parentHasViewTag);
      });
      let parent = klass;
      while ((parent = Object.getPrototypeOf(parent)) && parent !== Schema && // stop at root (Schema)
      parent !== Function.prototype) {
        this.discoverTypes(parent);
      }
      const metadata = klass[_a7 = Symbol.metadata] ?? (klass[_a7] = {});
      if (metadata[$viewFieldIndexes]) {
        this.hasFilters = true;
      }
      for (const fieldIndex in metadata) {
        const index = fieldIndex;
        const fieldType = metadata[index].type;
        const fieldHasViewTag = metadata[index].tag !== void 0;
        if (typeof fieldType === "string") {
          continue;
        }
        if (typeof fieldType === "function") {
          this.discoverTypes(fieldType, klass, index, parentHasViewTag || fieldHasViewTag);
        } else {
          const type = Object.values(fieldType)[0];
          if (typeof type === "string") {
            continue;
          }
          this.discoverTypes(type, klass, index, parentHasViewTag || fieldHasViewTag);
        }
      }
    }
    /**
     * Keep track of which classes have filters applied.
     * Format: `${typeid}-${parentTypeid}-${parentIndex}`
     */
    registerFilteredByParent(schema2, parentType, parentIndex) {
      const typeid = this.schemas.get(schema2) ?? this.schemas.size;
      let key = `${typeid}`;
      if (parentType) {
        key += `-${this.schemas.get(parentType)}`;
      }
      key += `-${parentIndex}`;
      this.parentFiltered[key] = true;
    }
    debug() {
      let parentFiltered = "";
      for (const key in this.parentFiltered) {
        const keys = key.split("-").map(Number);
        const fieldIndex = keys.pop();
        parentFiltered += `
		`;
        parentFiltered += `${key}: ${keys.reverse().map((id2, i2) => {
          const klass = this.types[id2];
          const metadata = klass[Symbol.metadata];
          let txt = klass.name;
          if (i2 === 0) {
            txt += `[${metadata[fieldIndex].name}]`;
          }
          return `${txt}`;
        }).join(" -> ")}`;
      }
      return `TypeContext ->
	Schema types: ${this.schemas.size}
	hasFilters: ${this.hasFilters}
	parentFiltered:${parentFiltered}`;
    }
  };
  /**
   * For inheritance support
   * Keeps track of which classes extends which. (parent -> children)
   */
  __publicField(_TypeContext, "inheritedTypes", /* @__PURE__ */ new Map());
  __publicField(_TypeContext, "cachedContexts", /* @__PURE__ */ new Map());
  var TypeContext = _TypeContext;
  function getNormalizedType(type) {
    if (Array.isArray(type)) {
      return { array: getNormalizedType(type[0]) };
    } else if (typeof type["type"] !== "undefined") {
      return type["type"];
    } else if (isTSEnum(type)) {
      return Object.keys(type).every((key) => typeof type[key] === "string") ? "string" : "number";
    } else if (typeof type === "object" && type !== null) {
      const collectionType = Object.keys(type).find((k2) => registeredTypes[k2] !== void 0);
      if (collectionType) {
        type[collectionType] = getNormalizedType(type[collectionType]);
        return type;
      }
    }
    return type;
  }
  function isTSEnum(_enum) {
    if (typeof _enum === "function" && _enum[Symbol.metadata]) {
      return false;
    }
    const keys = Object.keys(_enum);
    const numericFields = keys.filter((k2) => /\d+/.test(k2));
    if (numericFields.length > 0 && numericFields.length === keys.length / 2 && _enum[_enum[numericFields[0]]] == numericFields[0]) {
      return true;
    }
    if (keys.length > 0 && keys.every((key) => typeof _enum[key] === "string" && _enum[key] === key)) {
      return true;
    }
    return false;
  }
  var Metadata = {
    addField(metadata, index, name, type, descriptor) {
      if (index > 64) {
        throw new Error(`Can't define field '${name}'.
Schema instances may only have up to 64 fields.`);
      }
      metadata[index] = Object.assign(
        metadata[index] || {},
        // avoid overwriting previous field metadata (@owned / @deprecated)
        {
          type: getNormalizedType(type),
          index,
          name
        }
      );
      Object.defineProperty(metadata, $descriptors, {
        value: metadata[$descriptors] || {},
        enumerable: false,
        configurable: true
      });
      if (descriptor) {
        metadata[$descriptors][name] = descriptor;
        metadata[$descriptors][`_${name}`] = {
          value: void 0,
          writable: true,
          enumerable: false,
          configurable: true
        };
      } else {
        metadata[$descriptors][name] = {
          value: void 0,
          writable: true,
          enumerable: true,
          configurable: true
        };
      }
      Object.defineProperty(metadata, $numFields, {
        value: index,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(metadata, name, {
        value: index,
        enumerable: false,
        configurable: true
      });
      if (typeof metadata[index].type !== "string") {
        if (metadata[$refTypeFieldIndexes] === void 0) {
          Object.defineProperty(metadata, $refTypeFieldIndexes, {
            value: [],
            enumerable: false,
            configurable: true
          });
        }
        metadata[$refTypeFieldIndexes].push(index);
      }
    },
    setTag(metadata, fieldName, tag) {
      const index = metadata[fieldName];
      const field = metadata[index];
      field.tag = tag;
      if (!metadata[$viewFieldIndexes]) {
        Object.defineProperty(metadata, $viewFieldIndexes, {
          value: [],
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(metadata, $fieldIndexesByViewTag, {
          value: {},
          enumerable: false,
          configurable: true
        });
      }
      metadata[$viewFieldIndexes].push(index);
      if (tag < 0) {
        if (!metadata[$fieldIndexesByViewTag][tag]) {
          metadata[$fieldIndexesByViewTag][tag] = [];
        }
        metadata[$fieldIndexesByViewTag][tag].push(index);
      } else {
        for (let bits = tag; bits > 0; bits &= bits - 1) {
          const bit = bits & -bits;
          if (!metadata[$fieldIndexesByViewTag][bit]) {
            metadata[$fieldIndexesByViewTag][bit] = [];
          }
          metadata[$fieldIndexesByViewTag][bit].push(index);
        }
      }
    },
    setFields(target2, fields) {
      const constructor = target2.prototype.constructor;
      TypeContext.register(constructor);
      const parentClass = Object.getPrototypeOf(constructor);
      const parentMetadata = parentClass && parentClass[Symbol.metadata];
      const metadata = Metadata.initialize(constructor);
      if (!constructor[$track]) {
        constructor[$track] = Schema[$track];
      }
      if (!constructor[$encoder]) {
        constructor[$encoder] = Schema[$encoder];
      }
      if (!constructor[$decoder]) {
        constructor[$decoder] = Schema[$decoder];
      }
      if (!constructor.prototype.toJSON) {
        constructor.prototype.toJSON = Schema.prototype.toJSON;
      }
      let fieldIndex = metadata[$numFields] ?? (parentMetadata && parentMetadata[$numFields]) ?? -1;
      fieldIndex++;
      for (const field in fields) {
        const type = getNormalizedType(fields[field]);
        const complexTypeKlass = typeof Object.keys(type)[0] === "string" && getType(Object.keys(type)[0]);
        const childType = complexTypeKlass ? Object.values(type)[0] : type;
        Metadata.addField(metadata, fieldIndex, field, type, getPropertyDescriptor(`_${field}`, fieldIndex, childType, complexTypeKlass));
        fieldIndex++;
      }
      return target2;
    },
    isDeprecated(metadata, field) {
      return metadata[field].deprecated === true;
    },
    init(klass) {
      const metadata = {};
      klass[Symbol.metadata] = metadata;
      Object.defineProperty(metadata, $numFields, {
        value: 0,
        enumerable: false,
        configurable: true
      });
    },
    initialize(constructor) {
      const parentClass = Object.getPrototypeOf(constructor);
      const parentMetadata = parentClass[Symbol.metadata];
      let metadata = constructor[Symbol.metadata] ?? /* @__PURE__ */ Object.create(null);
      if (parentClass !== Schema && metadata === parentMetadata) {
        metadata = /* @__PURE__ */ Object.create(null);
        if (parentMetadata) {
          Object.setPrototypeOf(metadata, parentMetadata);
          Object.defineProperty(metadata, $numFields, {
            value: parentMetadata[$numFields],
            enumerable: false,
            configurable: true,
            writable: true
          });
          if (parentMetadata[$viewFieldIndexes] !== void 0) {
            Object.defineProperty(metadata, $viewFieldIndexes, {
              value: [...parentMetadata[$viewFieldIndexes]],
              enumerable: false,
              configurable: true,
              writable: true
            });
            Object.defineProperty(metadata, $fieldIndexesByViewTag, {
              value: { ...parentMetadata[$fieldIndexesByViewTag] },
              enumerable: false,
              configurable: true,
              writable: true
            });
          }
          if (parentMetadata[$refTypeFieldIndexes] !== void 0) {
            Object.defineProperty(metadata, $refTypeFieldIndexes, {
              value: [...parentMetadata[$refTypeFieldIndexes]],
              enumerable: false,
              configurable: true,
              writable: true
            });
          }
          Object.defineProperty(metadata, $descriptors, {
            value: { ...parentMetadata[$descriptors] },
            enumerable: false,
            configurable: true,
            writable: true
          });
        }
      }
      Object.defineProperty(constructor, Symbol.metadata, {
        value: metadata,
        writable: false,
        configurable: true
      });
      return metadata;
    },
    isValidInstance(klass) {
      return klass.constructor[Symbol.metadata] && Object.prototype.hasOwnProperty.call(klass.constructor[Symbol.metadata], $numFields);
    },
    getFields(klass) {
      const metadata = klass[Symbol.metadata];
      const fields = {};
      for (let i2 = 0; i2 <= metadata[$numFields]; i2++) {
        fields[metadata[i2].name] = metadata[i2].type;
      }
      return fields;
    },
    hasViewTagAtIndex(metadata, index) {
      return metadata?.[$viewFieldIndexes]?.includes(index);
    }
  };
  function createChangeSet(queueRootNode) {
    return { indexes: {}, operations: [], queueRootNode };
  }
  function createChangeTreeList() {
    return { next: void 0, tail: void 0 };
  }
  function setOperationAtIndex(changeSet, index) {
    const operationsIndex = changeSet.indexes[index];
    if (operationsIndex === void 0) {
      changeSet.indexes[index] = changeSet.operations.push(index) - 1;
    } else {
      changeSet.operations[operationsIndex] = index;
    }
  }
  function deleteOperationAtIndex(changeSet, index) {
    let operationsIndex = changeSet.indexes[index];
    if (operationsIndex === void 0) {
      operationsIndex = Object.values(changeSet.indexes).at(-1);
      index = Object.entries(changeSet.indexes).find(([_2, value]) => value === operationsIndex)?.[0];
    }
    changeSet.operations[operationsIndex] = void 0;
    delete changeSet.indexes[index];
  }
  var ChangeTree = class {
    constructor(ref) {
      __publicField(this, "ref");
      __publicField(this, "metadata");
      __publicField(this, "root");
      __publicField(this, "parentChain");
      // Linked list for tracking parents
      /**
       * Whether this structure is parent of a filtered structure.
       */
      __publicField(this, "isFiltered", false);
      __publicField(this, "isVisibilitySharedWithParent");
      // See test case: 'should not be required to manually call view.add() items to child arrays without @view() tag'
      __publicField(this, "indexedOperations", {});
      //
      // TODO:
      //   try storing the index + operation per item.
      //   example: 1024 & 1025 => ADD, 1026 => DELETE
      //
      // => https://chatgpt.com/share/67107d0c-bc20-8004-8583-83b17dd7c196
      //
      __publicField(this, "changes", { indexes: {}, operations: [] });
      __publicField(this, "allChanges", { indexes: {}, operations: [] });
      __publicField(this, "filteredChanges");
      __publicField(this, "allFilteredChanges");
      __publicField(this, "indexes");
      // TODO: remove this, only used by MapSchema/SetSchema/CollectionSchema (`encodeKeyValueOperation`)
      /**
       * Is this a new instance? Used on ArraySchema to determine OPERATION.MOVE_AND_ADD operation.
       */
      __publicField(this, "isNew", true);
      this.ref = ref;
      this.metadata = ref.constructor[Symbol.metadata];
      if (this.metadata?.[$viewFieldIndexes]) {
        this.allFilteredChanges = { indexes: {}, operations: [] };
        this.filteredChanges = { indexes: {}, operations: [] };
      }
    }
    setRoot(root) {
      this.root = root;
      const isNewChangeTree = this.root.add(this);
      this.checkIsFiltered(this.parent, this.parentIndex, isNewChangeTree);
      if (isNewChangeTree) {
        this.forEachChild((child, _2) => {
          if (child.root !== root) {
            child.setRoot(root);
          } else {
            root.add(child);
          }
        });
      }
    }
    setParent(parent, root, parentIndex) {
      this.addParent(parent, parentIndex);
      if (!root) {
        return;
      }
      const isNewChangeTree = root.add(this);
      if (root !== this.root) {
        this.root = root;
        this.checkIsFiltered(parent, parentIndex, isNewChangeTree);
      }
      if (isNewChangeTree) {
        this.forEachChild((child, index) => {
          if (child.root === root) {
            root.add(child);
            root.moveNextToParent(child);
            return;
          }
          child.setParent(this.ref, root, index);
        });
      }
    }
    forEachChild(callback) {
      if (this.ref[$childType]) {
        if (typeof this.ref[$childType] !== "string") {
          for (const [key, value] of this.ref.entries()) {
            if (!value) {
              continue;
            }
            callback(value[$changes], this.indexes?.[key] ?? key);
          }
        }
      } else {
        for (const index of this.metadata?.[$refTypeFieldIndexes] ?? []) {
          const field = this.metadata[index];
          const value = this.ref[field.name];
          if (!value) {
            continue;
          }
          callback(value[$changes], index);
        }
      }
    }
    operation(op2) {
      if (this.filteredChanges !== void 0) {
        this.filteredChanges.operations.push(-op2);
        this.root?.enqueueChangeTree(this, "filteredChanges");
      } else {
        this.changes.operations.push(-op2);
        this.root?.enqueueChangeTree(this, "changes");
      }
    }
    change(index, operation = OPERATION.ADD) {
      const isFiltered = this.isFiltered || this.metadata?.[index]?.tag !== void 0;
      const changeSet = isFiltered ? this.filteredChanges : this.changes;
      const previousOperation = this.indexedOperations[index];
      if (!previousOperation || previousOperation === OPERATION.DELETE) {
        const op2 = !previousOperation ? operation : previousOperation === OPERATION.DELETE ? OPERATION.DELETE_AND_ADD : operation;
        this.indexedOperations[index] = op2;
      }
      setOperationAtIndex(changeSet, index);
      if (isFiltered) {
        setOperationAtIndex(this.allFilteredChanges, index);
        if (this.root) {
          this.root.enqueueChangeTree(this, "filteredChanges");
          this.root.enqueueChangeTree(this, "allFilteredChanges");
        }
      } else {
        setOperationAtIndex(this.allChanges, index);
        this.root?.enqueueChangeTree(this, "changes");
      }
    }
    shiftChangeIndexes(shiftIndex) {
      const changeSet = this.isFiltered ? this.filteredChanges : this.changes;
      const newIndexedOperations = {};
      const newIndexes = {};
      for (const index in this.indexedOperations) {
        newIndexedOperations[Number(index) + shiftIndex] = this.indexedOperations[index];
        newIndexes[Number(index) + shiftIndex] = changeSet.indexes[index];
      }
      this.indexedOperations = newIndexedOperations;
      changeSet.indexes = newIndexes;
      changeSet.operations = changeSet.operations.map((index) => index + shiftIndex);
    }
    shiftAllChangeIndexes(shiftIndex, startIndex = 0) {
      if (this.filteredChanges !== void 0) {
        this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allFilteredChanges);
        this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allChanges);
      } else {
        this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allChanges);
      }
    }
    _shiftAllChangeIndexes(shiftIndex, startIndex = 0, changeSet) {
      const newIndexes = {};
      let newKey = 0;
      for (const key in changeSet.indexes) {
        newIndexes[newKey++] = changeSet.indexes[key];
      }
      changeSet.indexes = newIndexes;
      for (let i2 = 0; i2 < changeSet.operations.length; i2++) {
        const index = changeSet.operations[i2];
        if (index > startIndex) {
          changeSet.operations[i2] = index + shiftIndex;
        }
      }
    }
    indexedOperation(index, operation, allChangesIndex = index) {
      this.indexedOperations[index] = operation;
      if (this.filteredChanges !== void 0) {
        setOperationAtIndex(this.allFilteredChanges, allChangesIndex);
        setOperationAtIndex(this.filteredChanges, index);
        this.root?.enqueueChangeTree(this, "filteredChanges");
      } else {
        setOperationAtIndex(this.allChanges, allChangesIndex);
        setOperationAtIndex(this.changes, index);
        this.root?.enqueueChangeTree(this, "changes");
      }
    }
    getType(index) {
      return (
        //
        // Get the child type from parent structure.
        // - ["string"] => "string"
        // - { map: "string" } => "string"
        // - { set: "string" } => "string"
        //
        this.ref[$childType] || // ArraySchema | MapSchema | SetSchema | CollectionSchema
        this.metadata[index].type
      );
    }
    getChange(index) {
      return this.indexedOperations[index];
    }
    //
    // used during `.encode()`
    //
    getValue(index, isEncodeAll = false) {
      return this.ref[$getByIndex](index, isEncodeAll);
    }
    delete(index, operation, allChangesIndex = index) {
      if (index === void 0) {
        try {
          throw new Error(`@colyseus/schema ${this.ref.constructor.name}: trying to delete non-existing index '${index}'`);
        } catch (e2) {
          console.warn(e2);
        }
        return;
      }
      const isFiltered = this.isFiltered || this.metadata?.[index]?.tag !== void 0;
      const changeSet = isFiltered ? this.filteredChanges : this.changes;
      this.indexedOperations[index] = operation ?? OPERATION.DELETE;
      setOperationAtIndex(changeSet, index);
      if (isFiltered) {
        deleteOperationAtIndex(this.allFilteredChanges, allChangesIndex);
      } else {
        deleteOperationAtIndex(this.allChanges, allChangesIndex);
      }
      const previousValue = this.getValue(index);
      if (previousValue && previousValue[$changes]) {
        this.root?.remove(previousValue[$changes]);
      }
      if (isFiltered) {
        this.root?.enqueueChangeTree(this, "filteredChanges");
      } else {
        this.root?.enqueueChangeTree(this, "changes");
      }
      return previousValue;
    }
    endEncode(changeSetName) {
      this.indexedOperations = {};
      this[changeSetName] = createChangeSet();
      this.ref[$onEncodeEnd]?.();
      this.isNew = false;
    }
    discard(discardAll = false) {
      this.ref[$onEncodeEnd]?.();
      this.indexedOperations = {};
      this.changes = createChangeSet(this.changes.queueRootNode);
      if (this.filteredChanges !== void 0) {
        this.filteredChanges = createChangeSet(this.filteredChanges.queueRootNode);
      }
      if (discardAll) {
        this.allChanges = createChangeSet(this.allChanges.queueRootNode);
        if (this.allFilteredChanges !== void 0) {
          this.allFilteredChanges = createChangeSet(this.allFilteredChanges.queueRootNode);
        }
      }
    }
    /**
     * Recursively discard all changes from this, and child structures.
     * (Used in tests only)
     */
    discardAll() {
      const keys = Object.keys(this.indexedOperations);
      for (let i2 = 0, len = keys.length; i2 < len; i2++) {
        const value = this.getValue(Number(keys[i2]));
        if (value && value[$changes]) {
          value[$changes].discardAll();
        }
      }
      this.discard();
    }
    get changed() {
      return Object.entries(this.indexedOperations).length > 0;
    }
    checkIsFiltered(parent, parentIndex, isNewChangeTree) {
      if (this.root.types.hasFilters) {
        this._checkFilteredByParent(parent, parentIndex);
        if (this.filteredChanges !== void 0) {
          this.root?.enqueueChangeTree(this, "filteredChanges");
          if (isNewChangeTree) {
            this.root?.enqueueChangeTree(this, "allFilteredChanges");
          }
        }
      }
      if (!this.isFiltered) {
        this.root?.enqueueChangeTree(this, "changes");
        if (isNewChangeTree) {
          this.root?.enqueueChangeTree(this, "allChanges");
        }
      }
    }
    _checkFilteredByParent(parent, parentIndex) {
      if (!parent) {
        return;
      }
      const refType = Metadata.isValidInstance(this.ref) ? this.ref.constructor : this.ref[$childType];
      let parentChangeTree;
      let parentIsCollection = !Metadata.isValidInstance(parent);
      if (parentIsCollection) {
        parentChangeTree = parent[$changes];
        parent = parentChangeTree.parent;
        parentIndex = parentChangeTree.parentIndex;
      } else {
        parentChangeTree = parent[$changes];
      }
      const parentConstructor = parent.constructor;
      let key = `${this.root.types.getTypeId(refType)}`;
      if (parentConstructor) {
        key += `-${this.root.types.schemas.get(parentConstructor)}`;
      }
      key += `-${parentIndex}`;
      const parentMetadata = parentConstructor?.[Symbol.metadata];
      const fieldHasViewTag = Metadata.hasViewTagAtIndex(parentMetadata, parentIndex);
      this.isFiltered = parent[$changes].isFiltered || this.root.types.parentFiltered[key] || fieldHasViewTag;
      if (this.isFiltered) {
        this.isVisibilitySharedWithParent = parentChangeTree.isFiltered && typeof refType !== "string" && (!fieldHasViewTag || parentIsCollection && parentMetadata[parentIndex].tag !== DEFAULT_VIEW_TAG);
        if (!this.filteredChanges) {
          this.filteredChanges = createChangeSet();
          this.allFilteredChanges = createChangeSet();
        }
        if (this.changes.operations.length > 0) {
          this.changes.operations.forEach((index) => setOperationAtIndex(this.filteredChanges, index));
          this.allChanges.operations.forEach((index) => setOperationAtIndex(this.allFilteredChanges, index));
          this.changes = createChangeSet();
          this.allChanges = createChangeSet();
        }
      }
    }
    /**
     * Get the immediate parent
     */
    get parent() {
      return this.parentChain?.ref;
    }
    /**
     * Get the immediate parent index
     */
    get parentIndex() {
      return this.parentChain?.index;
    }
    /**
     * Add a parent to the chain
     */
    addParent(parent, index) {
      if (this.hasParent((p2, _2) => p2[$changes] === parent[$changes])) {
        this.parentChain.index = index;
        return;
      }
      this.parentChain = {
        ref: parent,
        index,
        next: this.parentChain
      };
    }
    /**
     * Remove a parent from the chain
     * @param parent - The parent to remove
     * @returns true if parent was removed
     */
    removeParent(parent = this.parent) {
      let current = this.parentChain;
      let previous = null;
      while (current) {
        if (current.ref[$changes] === parent[$changes]) {
          if (previous) {
            previous.next = current.next;
          } else {
            this.parentChain = current.next;
          }
          return true;
        }
        previous = current;
        current = current.next;
      }
      return this.parentChain === void 0;
    }
    /**
     * Find a specific parent in the chain
     */
    findParent(predicate) {
      let current = this.parentChain;
      while (current) {
        if (predicate(current.ref, current.index)) {
          return current;
        }
        current = current.next;
      }
      return void 0;
    }
    /**
     * Check if this ChangeTree has a specific parent
     */
    hasParent(predicate) {
      return this.findParent(predicate) !== void 0;
    }
    /**
     * Get all parents as an array (for debugging/testing)
     */
    getAllParents() {
      const parents = [];
      let current = this.parentChain;
      while (current) {
        parents.push({ ref: current.ref, index: current.index });
        current = current.next;
      }
      return parents;
    }
  };
  function encodeValue(encoder, bytes, type, value, operation, it2) {
    if (typeof type === "string") {
      encode[type]?.(bytes, value, it2);
    } else if (type[Symbol.metadata] !== void 0) {
      encode.number(bytes, value[$refId], it2);
      if ((operation & OPERATION.ADD) === OPERATION.ADD) {
        encoder.tryEncodeTypeId(bytes, type, value.constructor, it2);
      }
    } else {
      encode.number(bytes, value[$refId], it2);
    }
  }
  var encodeSchemaOperation = function(encoder, bytes, changeTree, index, operation, it2, _2, __, metadata) {
    bytes[it2.offset++] = (index | operation) & 255;
    if (operation === OPERATION.DELETE) {
      return;
    }
    const ref = changeTree.ref;
    const field = metadata[index];
    encodeValue(encoder, bytes, metadata[index].type, ref[field.name], operation, it2);
  };
  var encodeKeyValueOperation = function(encoder, bytes, changeTree, index, operation, it2) {
    bytes[it2.offset++] = operation & 255;
    encode.number(bytes, index, it2);
    if (operation === OPERATION.DELETE) {
      return;
    }
    const ref = changeTree.ref;
    if ((operation & OPERATION.ADD) === OPERATION.ADD) {
      if (typeof ref["set"] === "function") {
        const dynamicIndex = changeTree.ref["$indexes"].get(index);
        encode.string(bytes, dynamicIndex, it2);
      }
    }
    const type = ref[$childType];
    const value = ref[$getByIndex](index);
    encodeValue(encoder, bytes, type, value, operation, it2);
  };
  var encodeArray = function(encoder, bytes, changeTree, field, operation, it2, isEncodeAll, hasView) {
    const ref = changeTree.ref;
    const useOperationByRefId = hasView && changeTree.isFiltered && typeof changeTree.getType(field) !== "string";
    let refOrIndex;
    if (useOperationByRefId) {
      const item = ref["tmpItems"][field];
      if (!item) {
        return;
      }
      refOrIndex = item[$refId];
      if (operation === OPERATION.DELETE) {
        operation = OPERATION.DELETE_BY_REFID;
      } else if (operation === OPERATION.ADD) {
        operation = OPERATION.ADD_BY_REFID;
      }
    } else {
      refOrIndex = field;
    }
    bytes[it2.offset++] = operation & 255;
    encode.number(bytes, refOrIndex, it2);
    if (operation === OPERATION.DELETE || operation === OPERATION.DELETE_BY_REFID) {
      return;
    }
    const type = changeTree.getType(field);
    const value = changeTree.getValue(field, isEncodeAll);
    encodeValue(encoder, bytes, type, value, operation, it2);
  };
  var DEFINITION_MISMATCH = -1;
  function decodeValue(decoder2, operation, ref, index, type, bytes, it2, allChanges) {
    const $root = decoder2.root;
    const previousValue = ref[$getByIndex](index);
    let value;
    if ((operation & OPERATION.DELETE) === OPERATION.DELETE) {
      const previousRefId = previousValue?.[$refId];
      if (previousRefId !== void 0) {
        $root.removeRef(previousRefId);
      }
      if (operation !== OPERATION.DELETE_AND_ADD) {
        ref[$deleteByIndex](index);
      }
      value = void 0;
    }
    if (operation === OPERATION.DELETE) ;
    else if (Schema.is(type)) {
      const refId = decode.number(bytes, it2);
      value = $root.refs.get(refId);
      if ((operation & OPERATION.ADD) === OPERATION.ADD) {
        const childType = decoder2.getInstanceType(bytes, it2, type);
        if (!value) {
          value = decoder2.createInstanceOfType(childType);
        }
        $root.addRef(refId, value, value !== previousValue || // increment ref count if value has changed
        operation === OPERATION.DELETE_AND_ADD && value === previousValue);
      }
    } else if (typeof type === "string") {
      value = decode[type](bytes, it2);
    } else {
      const typeDef = getType(Object.keys(type)[0]);
      const refId = decode.number(bytes, it2);
      const valueRef = $root.refs.has(refId) ? previousValue || $root.refs.get(refId) : new typeDef.constructor();
      value = valueRef.clone(true);
      value[$childType] = Object.values(type)[0];
      if (previousValue) {
        let previousRefId = previousValue[$refId];
        if (previousRefId !== void 0 && refId !== previousRefId) {
          if ((operation & OPERATION.DELETE) !== OPERATION.DELETE) {
            $root.removeRef(previousRefId);
          }
          const entries = previousValue.entries();
          let iter;
          while ((iter = entries.next()) && !iter.done) {
            const [key, value2] = iter.value;
            if (typeof value2 === "object") {
              previousRefId = value2[$refId];
            }
            allChanges.push({
              ref: previousValue,
              refId: previousRefId,
              op: OPERATION.DELETE,
              field: key,
              value: void 0,
              previousValue: value2
            });
          }
        }
      }
      $root.addRef(refId, value, valueRef !== previousValue || operation === OPERATION.DELETE_AND_ADD && valueRef === previousValue);
    }
    return { value, previousValue };
  }
  var decodeSchemaOperation = function(decoder2, bytes, it2, ref, allChanges) {
    const first_byte = bytes[it2.offset++];
    const metadata = ref.constructor[Symbol.metadata];
    const operation = first_byte >> 6 << 6;
    const index = first_byte % (operation || 255);
    const field = metadata[index];
    if (field === void 0) {
      console.warn("@colyseus/schema: field not defined at", { index, ref: ref.constructor.name, metadata });
      return DEFINITION_MISMATCH;
    }
    const { value, previousValue } = decodeValue(decoder2, operation, ref, index, field.type, bytes, it2, allChanges);
    if (value !== null && value !== void 0) {
      ref[field.name] = value;
    }
    if (previousValue !== value) {
      allChanges.push({
        ref,
        refId: decoder2.currentRefId,
        op: operation,
        field: field.name,
        value,
        previousValue
      });
    }
  };
  var decodeKeyValueOperation = function(decoder2, bytes, it2, ref, allChanges) {
    const operation = bytes[it2.offset++];
    if (operation === OPERATION.CLEAR) {
      decoder2.removeChildRefs(ref, allChanges);
      ref.clear();
      return;
    }
    const index = decode.number(bytes, it2);
    const type = ref[$childType];
    let dynamicIndex;
    if ((operation & OPERATION.ADD) === OPERATION.ADD) {
      if (typeof ref["set"] === "function") {
        dynamicIndex = decode.string(bytes, it2);
        ref["setIndex"](index, dynamicIndex);
      } else {
        dynamicIndex = index;
      }
    } else {
      dynamicIndex = ref["getIndex"](index);
    }
    const { value, previousValue } = decodeValue(decoder2, operation, ref, index, type, bytes, it2, allChanges);
    if (value !== null && value !== void 0) {
      if (typeof ref["set"] === "function") {
        ref["$items"].set(dynamicIndex, value);
      } else if (typeof ref["$setAt"] === "function") {
        ref["$setAt"](index, value, operation);
      } else if (typeof ref["add"] === "function") {
        const index2 = ref.add(value);
        if (typeof index2 === "number") {
          ref["setIndex"](index2, index2);
        }
      }
    }
    if (previousValue !== value) {
      allChanges.push({
        ref,
        refId: decoder2.currentRefId,
        op: operation,
        field: "",
        // FIXME: remove this
        dynamicIndex,
        value,
        previousValue
      });
    }
  };
  var decodeArray = function(decoder2, bytes, it2, ref, allChanges) {
    let operation = bytes[it2.offset++];
    let index;
    if (operation === OPERATION.CLEAR) {
      decoder2.removeChildRefs(ref, allChanges);
      ref.clear();
      return;
    } else if (operation === OPERATION.REVERSE) {
      ref.reverse();
      return;
    } else if (operation === OPERATION.DELETE_BY_REFID) {
      const refId = decode.number(bytes, it2);
      const previousValue2 = decoder2.root.refs.get(refId);
      index = ref.findIndex((value2) => value2 === previousValue2);
      ref[$deleteByIndex](index);
      allChanges.push({
        ref,
        refId: decoder2.currentRefId,
        op: OPERATION.DELETE,
        field: "",
        // FIXME: remove this
        dynamicIndex: index,
        value: void 0,
        previousValue: previousValue2
      });
      return;
    } else if (operation === OPERATION.ADD_BY_REFID) {
      const refId = decode.number(bytes, it2);
      const itemByRefId = decoder2.root.refs.get(refId);
      if (itemByRefId) {
        index = ref.findIndex((value2) => value2 === itemByRefId);
      }
      if (index === -1 || index === void 0) {
        index = ref.length;
      }
    } else {
      index = decode.number(bytes, it2);
    }
    const type = ref[$childType];
    let dynamicIndex = index;
    const { value, previousValue } = decodeValue(decoder2, operation, ref, index, type, bytes, it2, allChanges);
    if (value !== null && value !== void 0 && value !== previousValue) {
      ref["$setAt"](index, value, operation);
    }
    if (previousValue !== value) {
      allChanges.push({
        ref,
        refId: decoder2.currentRefId,
        op: operation,
        field: "",
        // FIXME: remove this
        dynamicIndex,
        value,
        previousValue
      });
    }
  };
  var EncodeSchemaError = class extends Error {
  };
  function assertType(value, type, klass, field) {
    let typeofTarget;
    let allowNull = false;
    switch (type) {
      case "number":
      case "int8":
      case "uint8":
      case "int16":
      case "uint16":
      case "int32":
      case "uint32":
      case "int64":
      case "uint64":
      case "float32":
      case "float64":
        typeofTarget = "number";
        if (isNaN(value)) {
          console.log(`trying to encode "NaN" in ${klass.constructor.name}#${field}`);
        }
        break;
      case "bigint64":
      case "biguint64":
        typeofTarget = "bigint";
        break;
      case "string":
        typeofTarget = "string";
        allowNull = true;
        break;
      case "boolean":
        return;
      default:
        return;
    }
    if (typeof value !== typeofTarget && (!allowNull || allowNull && value !== null)) {
      let foundValue = `'${JSON.stringify(value)}'${value && value.constructor && ` (${value.constructor.name})` || ""}`;
      throw new EncodeSchemaError(`a '${typeofTarget}' was expected, but ${foundValue} was provided in ${klass.constructor.name}#${field}`);
    }
  }
  function assertInstanceType(value, type, instance, field) {
    if (!(value instanceof type)) {
      throw new EncodeSchemaError(`a '${type.name}' was expected, but '${value && value.constructor.name}' was provided in ${instance.constructor.name}#${field}`);
    }
  }
  var DEFAULT_SORT = (a2, b2) => {
    const A2 = a2.toString();
    const B2 = b2.toString();
    if (A2 < B2)
      return -1;
    else if (A2 > B2)
      return 1;
    else
      return 0;
  };
  var _a2, _b, _c2, _d2, _e2, _f2;
  var _ArraySchema = class _ArraySchema {
    constructor(...items) {
      __publicField(this, _f2);
      __publicField(this, _e2);
      __publicField(this, _d2);
      __publicField(this, "items", []);
      __publicField(this, "tmpItems", []);
      __publicField(this, "deletedIndexes", {});
      __publicField(this, "isMovingItems", false);
      // WORKAROUND for compatibility
      // - TypeScript 4 defines @@unscopables as a function
      // - TypeScript 5 defines @@unscopables as an object
      __publicField(this, _a2);
      Object.defineProperty(this, $childType, {
        value: void 0,
        enumerable: false,
        writable: true,
        configurable: true
      });
      const proxy = new Proxy(this, {
        get: (obj, prop) => {
          if (typeof prop !== "symbol" && // FIXME: d8 accuses this as low performance
          !isNaN(prop)) {
            return this.items[prop];
          } else {
            return Reflect.get(obj, prop);
          }
        },
        set: (obj, key, setValue) => {
          if (typeof key !== "symbol" && !isNaN(key)) {
            if (setValue === void 0 || setValue === null) {
              obj.$deleteAt(key);
            } else {
              if (setValue[$changes]) {
                assertInstanceType(setValue, obj[$childType], obj, key);
                const previousValue = obj.items[key];
                if (!obj.isMovingItems) {
                  obj.$changeAt(Number(key), setValue);
                } else {
                  if (previousValue !== void 0) {
                    if (setValue[$changes].isNew) {
                      obj[$changes].indexedOperation(Number(key), OPERATION.MOVE_AND_ADD);
                    } else {
                      if ((obj[$changes].getChange(Number(key)) & OPERATION.DELETE) === OPERATION.DELETE) {
                        obj[$changes].indexedOperation(Number(key), OPERATION.DELETE_AND_MOVE);
                      } else {
                        obj[$changes].indexedOperation(Number(key), OPERATION.MOVE);
                      }
                    }
                  } else if (setValue[$changes].isNew) {
                    obj[$changes].indexedOperation(Number(key), OPERATION.ADD);
                  }
                  setValue[$changes].setParent(this, obj[$changes].root, key);
                }
                if (previousValue !== void 0) {
                  previousValue[$changes].root?.remove(previousValue[$changes]);
                }
              } else {
                obj.$changeAt(Number(key), setValue);
              }
              obj.items[key] = setValue;
              obj.tmpItems[key] = setValue;
            }
            return true;
          } else {
            return Reflect.set(obj, key, setValue);
          }
        },
        deleteProperty: (obj, prop) => {
          if (typeof prop === "number") {
            obj.$deleteAt(prop);
          } else {
            delete obj[prop];
          }
          return true;
        },
        has: (obj, key) => {
          if (typeof key !== "symbol" && !isNaN(Number(key))) {
            return Reflect.has(this.items, key);
          }
          return Reflect.has(obj, key);
        }
      });
      Object.defineProperty(this, $changes, {
        value: new ChangeTree(proxy),
        enumerable: false,
        writable: true
      });
      if (items.length > 0) {
        this.push(...items);
      }
      return proxy;
    }
    /**
     * Determine if a property must be filtered.
     * - If returns false, the property is NOT going to be encoded.
     * - If returns true, the property is going to be encoded.
     *
     * Encoding with "filters" happens in two steps:
     * - First, the encoder iterates over all "not owned" properties and encodes them.
     * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
     */
    static [(_f2 = $changes, _e2 = $refId, _d2 = $childType, _c2 = $encoder, _b = $decoder, $filter)](ref, index, view2) {
      return !view2 || typeof ref[$childType] === "string" || view2.isChangeTreeVisible(ref["tmpItems"][index]?.[$changes]);
    }
    static is(type) {
      return (
        // type format: ["string"]
        Array.isArray(type) || // type format: { array: "string" }
        type["array"] !== void 0
      );
    }
    static from(iterable) {
      return new _ArraySchema(...Array.from(iterable));
    }
    set length(newLength) {
      if (newLength === 0) {
        this.clear();
      } else if (newLength < this.items.length) {
        this.splice(newLength, this.length - newLength);
      } else {
        console.warn("ArraySchema: can't set .length to a higher value than its length.");
      }
    }
    get length() {
      return this.items.length;
    }
    push(...values) {
      let length = this.tmpItems.length;
      const changeTree = this[$changes];
      for (let i2 = 0, l2 = values.length; i2 < l2; i2++, length++) {
        const value = values[i2];
        if (value === void 0 || value === null) {
          return;
        } else if (typeof value === "object" && this[$childType]) {
          assertInstanceType(value, this[$childType], this, i2);
        }
        changeTree.indexedOperation(length, OPERATION.ADD, this.items.length);
        this.items.push(value);
        this.tmpItems.push(value);
        value[$changes]?.setParent(this, changeTree.root, length);
      }
      return length;
    }
    /**
     * Removes the last element from an array and returns it.
     */
    pop() {
      let index = -1;
      for (let i2 = this.tmpItems.length - 1; i2 >= 0; i2--) {
        if (this.deletedIndexes[i2] !== true) {
          index = i2;
          break;
        }
      }
      if (index < 0) {
        return void 0;
      }
      this[$changes].delete(index, void 0, this.items.length - 1);
      this.deletedIndexes[index] = true;
      return this.items.pop();
    }
    at(index) {
      if (index < 0)
        index += this.length;
      return this.items[index];
    }
    // encoding only
    $changeAt(index, value) {
      if (value === void 0 || value === null) {
        console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");
        return;
      }
      if (this.items[index] === value) {
        return;
      }
      const operation = this.items[index] !== void 0 ? typeof value === "object" ? OPERATION.DELETE_AND_ADD : OPERATION.REPLACE : OPERATION.ADD;
      const changeTree = this[$changes];
      changeTree.change(index, operation);
      value[$changes]?.setParent(this, changeTree.root, index);
    }
    // encoding only
    $deleteAt(index, operation) {
      this[$changes].delete(index, operation);
    }
    // decoding only
    $setAt(index, value, operation) {
      if (index === 0 && operation === OPERATION.ADD && this.items[index] !== void 0) {
        this.items.unshift(value);
      } else if (operation === OPERATION.DELETE_AND_MOVE) {
        this.items.splice(index, 1);
        this.items[index] = value;
      } else {
        this.items[index] = value;
      }
    }
    clear() {
      if (this.items.length === 0) {
        return;
      }
      const changeTree = this[$changes];
      changeTree.forEachChild((childChangeTree, _2) => {
        changeTree.root?.remove(childChangeTree);
      });
      changeTree.discard(true);
      changeTree.operation(OPERATION.CLEAR);
      this.items.length = 0;
      this.tmpItems.length = 0;
    }
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    // @ts-ignore
    concat(...items) {
      return new _ArraySchema(...this.items.concat(...items));
    }
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator) {
      return this.items.join(separator);
    }
    /**
     * Reverses the elements in an Array.
     */
    // @ts-ignore
    reverse() {
      this[$changes].operation(OPERATION.REVERSE);
      this.items.reverse();
      this.tmpItems.reverse();
      return this;
    }
    /**
     * Removes the first element from an array and returns it.
     */
    shift() {
      if (this.items.length === 0) {
        return void 0;
      }
      const changeTree = this[$changes];
      const index = this.tmpItems.findIndex((item) => item === this.items[0]);
      const allChangesIndex = this.items.findIndex((item) => item === this.items[0]);
      changeTree.delete(index, OPERATION.DELETE, allChangesIndex);
      changeTree.shiftAllChangeIndexes(-1, allChangesIndex);
      this.deletedIndexes[index] = true;
      return this.items.shift();
    }
    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start, end) {
      const sliced = new _ArraySchema();
      sliced.push(...this.items.slice(start, end));
      return sliced;
    }
    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn = DEFAULT_SORT) {
      this.isMovingItems = true;
      const changeTree = this[$changes];
      const sortedItems = this.items.sort(compareFn);
      sortedItems.forEach((_2, i2) => changeTree.change(i2, OPERATION.REPLACE));
      this.tmpItems.sort(compareFn);
      this.isMovingItems = false;
      return this;
    }
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param insertItems Elements to insert into the array in place of the deleted elements.
     */
    splice(start, deleteCount, ...insertItems) {
      const changeTree = this[$changes];
      const itemsLength = this.items.length;
      const tmpItemsLength = this.tmpItems.length;
      const insertCount = insertItems.length;
      const indexes = [];
      for (let i2 = 0; i2 < tmpItemsLength; i2++) {
        if (this.deletedIndexes[i2] !== true) {
          indexes.push(i2);
        }
      }
      if (itemsLength > start) {
        if (deleteCount === void 0) {
          deleteCount = itemsLength - start;
        }
        for (let i2 = start; i2 < start + deleteCount; i2++) {
          const index = indexes[i2];
          changeTree.delete(index, OPERATION.DELETE);
          this.deletedIndexes[index] = true;
        }
      } else {
        deleteCount = 0;
      }
      if (insertCount > 0) {
        if (insertCount > deleteCount) {
          console.error("Inserting more elements than deleting during ArraySchema#splice()");
          throw new Error("ArraySchema#splice(): insertCount must be equal or lower than deleteCount.");
        }
        for (let i2 = 0; i2 < insertCount; i2++) {
          const addIndex = (indexes[start] ?? itemsLength) + i2;
          changeTree.indexedOperation(addIndex, this.deletedIndexes[addIndex] ? OPERATION.DELETE_AND_ADD : OPERATION.ADD);
          insertItems[i2][$changes]?.setParent(this, changeTree.root, addIndex);
        }
      }
      if (deleteCount > insertCount) {
        changeTree.shiftAllChangeIndexes(-(deleteCount - insertCount), indexes[start + insertCount]);
      }
      if (changeTree.filteredChanges !== void 0) {
        changeTree.root?.enqueueChangeTree(changeTree, "filteredChanges");
      } else {
        changeTree.root?.enqueueChangeTree(changeTree, "changes");
      }
      return this.items.splice(start, deleteCount, ...insertItems);
    }
    /**
     * Inserts new elements at the start of an array.
     * @param items  Elements to insert at the start of the Array.
     */
    unshift(...items) {
      const changeTree = this[$changes];
      changeTree.shiftChangeIndexes(items.length);
      if (changeTree.isFiltered) {
        setOperationAtIndex(changeTree.filteredChanges, this.items.length);
      } else {
        setOperationAtIndex(changeTree.allChanges, this.items.length);
      }
      items.forEach((_2, index) => {
        changeTree.change(index, OPERATION.ADD);
      });
      this.tmpItems.unshift(...items);
      return this.items.unshift(...items);
    }
    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    indexOf(searchElement, fromIndex) {
      return this.items.indexOf(searchElement, fromIndex);
    }
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    lastIndexOf(searchElement, fromIndex = this.length - 1) {
      return this.items.lastIndexOf(searchElement, fromIndex);
    }
    every(callbackfn, thisArg) {
      return this.items.every(callbackfn, thisArg);
    }
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls
     * the callbackfn function for each element in the array until the callbackfn returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(callbackfn, thisArg) {
      return this.items.some(callbackfn, thisArg);
    }
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn, thisArg) {
      return this.items.forEach(callbackfn, thisArg);
    }
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn, thisArg) {
      return this.items.map(callbackfn, thisArg);
    }
    filter(callbackfn, thisArg) {
      return this.items.filter(callbackfn, thisArg);
    }
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce(callbackfn, initialValue) {
      return this.items.reduce(callbackfn, initialValue);
    }
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight(callbackfn, initialValue) {
      return this.items.reduceRight(callbackfn, initialValue);
    }
    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate, thisArg) {
      return this.items.find(predicate, thisArg);
    }
    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate, thisArg) {
      return this.items.findIndex(predicate, thisArg);
    }
    /**
     * Returns the this object after filling the section identified by start and end with value
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value, start, end) {
      throw new Error("ArraySchema#fill() not implemented");
    }
    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target2, start, end) {
      throw new Error("ArraySchema#copyWithin() not implemented");
    }
    /**
     * Returns a string representation of an array.
     */
    toString() {
      return this.items.toString();
    }
    /**
     * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
     */
    toLocaleString() {
      return this.items.toLocaleString();
    }
    /** Iterator */
    [Symbol.iterator]() {
      return this.items[Symbol.iterator]();
    }
    static get [Symbol.species]() {
      return _ArraySchema;
    }
    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries() {
      return this.items.entries();
    }
    /**
     * Returns an iterable of keys in the array
     */
    keys() {
      return this.items.keys();
    }
    /**
     * Returns an iterable of values in the array
     */
    values() {
      return this.items.values();
    }
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement, fromIndex) {
      return this.items.includes(searchElement, fromIndex);
    }
    //
    // ES2022
    //
    /**
     * Calls a defined callback function on each element of an array. Then, flattens the result into
     * a new array.
     * This is identical to a map followed by flat with depth 1.
     *
     * @param callback A function that accepts up to three arguments. The flatMap method calls the
     * callback function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callback function. If
     * thisArg is omitted, undefined is used as the this value.
     */
    // @ts-ignore
    flatMap(callback, thisArg) {
      throw new Error("ArraySchema#flatMap() is not supported.");
    }
    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    // @ts-ignore
    flat(depth) {
      throw new Error("ArraySchema#flat() is not supported.");
    }
    findLast() {
      return this.items.findLast.apply(this.items, arguments);
    }
    findLastIndex(...args) {
      return this.items.findLastIndex.apply(this.items, arguments);
    }
    //
    // ES2023
    //
    with(index, value) {
      const copy2 = this.items.slice();
      if (index < 0)
        index += this.length;
      copy2[index] = value;
      return new _ArraySchema(...copy2);
    }
    toReversed() {
      return this.items.slice().reverse();
    }
    toSorted(compareFn) {
      return this.items.slice().sort(compareFn);
    }
    // @ts-ignore
    toSpliced(start, deleteCount, ...items) {
      return this.items.toSpliced.apply(copy, arguments);
    }
    shuffle() {
      return this.move((_2) => {
        let currentIndex = this.items.length;
        while (currentIndex != 0) {
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
        }
      });
    }
    /**
     * Allows to move items around in the array.
     *
     * Example:
     *     state.cards.move((cards) => {
     *         [cards[4], cards[3]] = [cards[3], cards[4]];
     *         [cards[3], cards[2]] = [cards[2], cards[3]];
     *         [cards[2], cards[0]] = [cards[0], cards[2]];
     *         [cards[1], cards[1]] = [cards[1], cards[1]];
     *         [cards[0], cards[0]] = [cards[0], cards[0]];
     *     })
     *
     * @param cb
     * @returns
     */
    move(cb) {
      this.isMovingItems = true;
      cb(this);
      this.isMovingItems = false;
      return this;
    }
    [(_a2 = Symbol.unscopables, $getByIndex)](index, isEncodeAll = false) {
      return isEncodeAll ? this.items[index] : this.deletedIndexes[index] ? this.items[index] : this.tmpItems[index] || this.items[index];
    }
    [$deleteByIndex](index) {
      this.items[index] = void 0;
      this.tmpItems[index] = void 0;
    }
    [$onEncodeEnd]() {
      this.tmpItems = this.items.slice();
      this.deletedIndexes = {};
    }
    [$onDecodeEnd]() {
      this.items = this.items.filter((item) => item !== void 0);
      this.tmpItems = this.items.slice();
    }
    toArray() {
      return this.items.slice(0);
    }
    toJSON() {
      return this.toArray().map((value) => {
        return typeof value["toJSON"] === "function" ? value["toJSON"]() : value;
      });
    }
    //
    // Decoding utilities
    //
    clone(isDecoding) {
      let cloned;
      if (isDecoding) {
        cloned = new _ArraySchema();
        cloned.push(...this.items);
      } else {
        cloned = new _ArraySchema(...this.map((item) => item[$changes] ? item.clone() : item));
      }
      return cloned;
    }
  };
  __publicField(_ArraySchema, _c2, encodeArray);
  __publicField(_ArraySchema, _b, decodeArray);
  var ArraySchema = _ArraySchema;
  registerType("array", { constructor: ArraySchema });
  var _a3, _b2, _c3, _d3, _e3;
  var _MapSchema = class _MapSchema {
    constructor(initialValues) {
      __publicField(this, _e3);
      __publicField(this, _d3);
      __publicField(this, "childType");
      __publicField(this, _c3);
      __publicField(this, "$items", /* @__PURE__ */ new Map());
      __publicField(this, "$indexes", /* @__PURE__ */ new Map());
      __publicField(this, "deletedItems", {});
      const changeTree = new ChangeTree(this);
      changeTree.indexes = {};
      Object.defineProperty(this, $changes, {
        value: changeTree,
        enumerable: false,
        writable: true
      });
      if (initialValues) {
        if (initialValues instanceof Map || initialValues instanceof _MapSchema) {
          initialValues.forEach((v2, k2) => this.set(k2, v2));
        } else {
          for (const k2 in initialValues) {
            this.set(k2, initialValues[k2]);
          }
        }
      }
      Object.defineProperty(this, $childType, {
        value: void 0,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
    /**
     * Determine if a property must be filtered.
     * - If returns false, the property is NOT going to be encoded.
     * - If returns true, the property is going to be encoded.
     *
     * Encoding with "filters" happens in two steps:
     * - First, the encoder iterates over all "not owned" properties and encodes them.
     * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
     */
    static [(_e3 = $changes, _d3 = $refId, _c3 = $childType, _b2 = $encoder, _a3 = $decoder, $filter)](ref, index, view2) {
      return !view2 || typeof ref[$childType] === "string" || view2.isChangeTreeVisible((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]);
    }
    static is(type) {
      return type["map"] !== void 0;
    }
    /** Iterator */
    [Symbol.iterator]() {
      return this.$items[Symbol.iterator]();
    }
    get [Symbol.toStringTag]() {
      return this.$items[Symbol.toStringTag];
    }
    static get [Symbol.species]() {
      return _MapSchema;
    }
    set(key, value) {
      if (value === void 0 || value === null) {
        throw new Error(`MapSchema#set('${key}', ${value}): trying to set ${value} value on '${key}'.`);
      } else if (typeof value === "object" && this[$childType]) {
        assertInstanceType(value, this[$childType], this, key);
      }
      key = key.toString();
      const changeTree = this[$changes];
      const isRef = value[$changes] !== void 0;
      let index;
      let operation;
      if (typeof changeTree.indexes[key] !== "undefined") {
        index = changeTree.indexes[key];
        operation = OPERATION.REPLACE;
        const previousValue = this.$items.get(key);
        if (previousValue === value) {
          return;
        } else if (isRef) {
          operation = OPERATION.DELETE_AND_ADD;
          if (previousValue !== void 0) {
            previousValue[$changes].root?.remove(previousValue[$changes]);
          }
        }
        if (this.deletedItems[index]) {
          delete this.deletedItems[index];
        }
      } else {
        index = changeTree.indexes[$numFields] ?? 0;
        operation = OPERATION.ADD;
        this.$indexes.set(index, key);
        changeTree.indexes[key] = index;
        changeTree.indexes[$numFields] = index + 1;
      }
      this.$items.set(key, value);
      changeTree.change(index, operation);
      if (isRef) {
        value[$changes].setParent(this, changeTree.root, index);
      }
      return this;
    }
    get(key) {
      return this.$items.get(key);
    }
    delete(key) {
      if (!this.$items.has(key)) {
        return false;
      }
      const index = this[$changes].indexes[key];
      this.deletedItems[index] = this[$changes].delete(index);
      return this.$items.delete(key);
    }
    clear() {
      const changeTree = this[$changes];
      changeTree.discard(true);
      changeTree.indexes = {};
      changeTree.forEachChild((childChangeTree, _2) => {
        changeTree.root?.remove(childChangeTree);
      });
      this.$indexes.clear();
      this.$items.clear();
      changeTree.operation(OPERATION.CLEAR);
    }
    has(key) {
      return this.$items.has(key);
    }
    forEach(callbackfn) {
      this.$items.forEach(callbackfn);
    }
    entries() {
      return this.$items.entries();
    }
    keys() {
      return this.$items.keys();
    }
    values() {
      return this.$items.values();
    }
    get size() {
      return this.$items.size;
    }
    setIndex(index, key) {
      this.$indexes.set(index, key);
    }
    getIndex(index) {
      return this.$indexes.get(index);
    }
    [$getByIndex](index) {
      return this.$items.get(this.$indexes.get(index));
    }
    [$deleteByIndex](index) {
      const key = this.$indexes.get(index);
      this.$items.delete(key);
      this.$indexes.delete(index);
    }
    [$onEncodeEnd]() {
      const changeTree = this[$changes];
      for (const indexStr in this.deletedItems) {
        const index = parseInt(indexStr);
        const key = this.$indexes.get(index);
        delete changeTree.indexes[key];
        this.$indexes.delete(index);
      }
      this.deletedItems = {};
    }
    toJSON() {
      const map = {};
      this.forEach((value, key) => {
        map[key] = typeof value["toJSON"] === "function" ? value["toJSON"]() : value;
      });
      return map;
    }
    //
    // Decoding utilities
    //
    // @ts-ignore
    clone(isDecoding) {
      let cloned;
      if (isDecoding) {
        cloned = Object.assign(new _MapSchema(), this);
      } else {
        cloned = new _MapSchema();
        this.forEach((value, key) => {
          if (value[$changes]) {
            cloned.set(key, value["clone"]());
          } else {
            cloned.set(key, value);
          }
        });
      }
      return cloned;
    }
  };
  __publicField(_MapSchema, _b2, encodeKeyValueOperation);
  __publicField(_MapSchema, _a3, decodeKeyValueOperation);
  var MapSchema = _MapSchema;
  registerType("map", { constructor: MapSchema });
  var _a4, _b3, _c4, _d4, _e4;
  var _CollectionSchema = class _CollectionSchema {
    constructor(initialValues) {
      __publicField(this, _e4);
      __publicField(this, _d4);
      __publicField(this, _c4);
      __publicField(this, "$items", /* @__PURE__ */ new Map());
      __publicField(this, "$indexes", /* @__PURE__ */ new Map());
      __publicField(this, "deletedItems", {});
      __publicField(this, "$refId", 0);
      this[$changes] = new ChangeTree(this);
      this[$changes].indexes = {};
      if (initialValues) {
        initialValues.forEach((v2) => this.add(v2));
      }
      Object.defineProperty(this, $childType, {
        value: void 0,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
    /**
     * Determine if a property must be filtered.
     * - If returns false, the property is NOT going to be encoded.
     * - If returns true, the property is going to be encoded.
     *
     * Encoding with "filters" happens in two steps:
     * - First, the encoder iterates over all "not owned" properties and encodes them.
     * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
     */
    static [(_e4 = $changes, _d4 = $refId, _c4 = $childType, _b3 = $encoder, _a4 = $decoder, $filter)](ref, index, view2) {
      return !view2 || typeof ref[$childType] === "string" || view2.isChangeTreeVisible((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]);
    }
    static is(type) {
      return type["collection"] !== void 0;
    }
    add(value) {
      const index = this.$refId++;
      const isRef = value[$changes] !== void 0;
      if (isRef) {
        value[$changes].setParent(this, this[$changes].root, index);
      }
      this[$changes].indexes[index] = index;
      this.$indexes.set(index, index);
      this.$items.set(index, value);
      this[$changes].change(index);
      return index;
    }
    at(index) {
      const key = Array.from(this.$items.keys())[index];
      return this.$items.get(key);
    }
    entries() {
      return this.$items.entries();
    }
    delete(item) {
      const entries = this.$items.entries();
      let index;
      let entry;
      while (entry = entries.next()) {
        if (entry.done) {
          break;
        }
        if (item === entry.value[1]) {
          index = entry.value[0];
          break;
        }
      }
      if (index === void 0) {
        return false;
      }
      this.deletedItems[index] = this[$changes].delete(index);
      this.$indexes.delete(index);
      return this.$items.delete(index);
    }
    clear() {
      const changeTree = this[$changes];
      changeTree.discard(true);
      changeTree.indexes = {};
      changeTree.forEachChild((childChangeTree, _2) => {
        changeTree.root?.remove(childChangeTree);
      });
      this.$indexes.clear();
      this.$items.clear();
      changeTree.operation(OPERATION.CLEAR);
    }
    has(value) {
      return Array.from(this.$items.values()).some((v2) => v2 === value);
    }
    forEach(callbackfn) {
      this.$items.forEach((value, key, _2) => callbackfn(value, key, this));
    }
    values() {
      return this.$items.values();
    }
    get size() {
      return this.$items.size;
    }
    /** Iterator */
    [Symbol.iterator]() {
      return this.$items.values();
    }
    setIndex(index, key) {
      this.$indexes.set(index, key);
    }
    getIndex(index) {
      return this.$indexes.get(index);
    }
    [$getByIndex](index) {
      return this.$items.get(this.$indexes.get(index));
    }
    [$deleteByIndex](index) {
      const key = this.$indexes.get(index);
      this.$items.delete(key);
      this.$indexes.delete(index);
    }
    [$onEncodeEnd]() {
      this.deletedItems = {};
    }
    toArray() {
      return Array.from(this.$items.values());
    }
    toJSON() {
      const values = [];
      this.forEach((value, key) => {
        values.push(typeof value["toJSON"] === "function" ? value["toJSON"]() : value);
      });
      return values;
    }
    //
    // Decoding utilities
    //
    clone(isDecoding) {
      let cloned;
      if (isDecoding) {
        cloned = Object.assign(new _CollectionSchema(), this);
      } else {
        cloned = new _CollectionSchema();
        this.forEach((value) => {
          if (value[$changes]) {
            cloned.add(value["clone"]());
          } else {
            cloned.add(value);
          }
        });
      }
      return cloned;
    }
  };
  __publicField(_CollectionSchema, _b3, encodeKeyValueOperation);
  __publicField(_CollectionSchema, _a4, decodeKeyValueOperation);
  var CollectionSchema = _CollectionSchema;
  registerType("collection", { constructor: CollectionSchema });
  var _a5, _b4, _c5, _d5, _e5;
  var _SetSchema = class _SetSchema {
    constructor(initialValues) {
      __publicField(this, _e5);
      __publicField(this, _d5);
      __publicField(this, _c5);
      __publicField(this, "$items", /* @__PURE__ */ new Map());
      __publicField(this, "$indexes", /* @__PURE__ */ new Map());
      __publicField(this, "deletedItems", {});
      __publicField(this, "$refId", 0);
      this[$changes] = new ChangeTree(this);
      this[$changes].indexes = {};
      if (initialValues) {
        initialValues.forEach((v2) => this.add(v2));
      }
      Object.defineProperty(this, $childType, {
        value: void 0,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
    /**
     * Determine if a property must be filtered.
     * - If returns false, the property is NOT going to be encoded.
     * - If returns true, the property is going to be encoded.
     *
     * Encoding with "filters" happens in two steps:
     * - First, the encoder iterates over all "not owned" properties and encodes them.
     * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
     */
    static [(_e5 = $changes, _d5 = $refId, _c5 = $childType, _b4 = $encoder, _a5 = $decoder, $filter)](ref, index, view2) {
      return !view2 || typeof ref[$childType] === "string" || view2.visible.has((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]);
    }
    static is(type) {
      return type["set"] !== void 0;
    }
    add(value) {
      if (this.has(value)) {
        return false;
      }
      const index = this.$refId++;
      if (value[$changes] !== void 0) {
        value[$changes].setParent(this, this[$changes].root, index);
      }
      const operation = this[$changes].indexes[index]?.op ?? OPERATION.ADD;
      this[$changes].indexes[index] = index;
      this.$indexes.set(index, index);
      this.$items.set(index, value);
      this[$changes].change(index, operation);
      return index;
    }
    entries() {
      return this.$items.entries();
    }
    delete(item) {
      const entries = this.$items.entries();
      let index;
      let entry;
      while (entry = entries.next()) {
        if (entry.done) {
          break;
        }
        if (item === entry.value[1]) {
          index = entry.value[0];
          break;
        }
      }
      if (index === void 0) {
        return false;
      }
      this.deletedItems[index] = this[$changes].delete(index);
      this.$indexes.delete(index);
      return this.$items.delete(index);
    }
    clear() {
      const changeTree = this[$changes];
      changeTree.discard(true);
      changeTree.indexes = {};
      this.$indexes.clear();
      this.$items.clear();
      changeTree.operation(OPERATION.CLEAR);
    }
    has(value) {
      const values = this.$items.values();
      let has = false;
      let entry;
      while (entry = values.next()) {
        if (entry.done) {
          break;
        }
        if (value === entry.value) {
          has = true;
          break;
        }
      }
      return has;
    }
    forEach(callbackfn) {
      this.$items.forEach((value, key, _2) => callbackfn(value, key, this));
    }
    values() {
      return this.$items.values();
    }
    get size() {
      return this.$items.size;
    }
    /** Iterator */
    [Symbol.iterator]() {
      return this.$items.values();
    }
    setIndex(index, key) {
      this.$indexes.set(index, key);
    }
    getIndex(index) {
      return this.$indexes.get(index);
    }
    [$getByIndex](index) {
      return this.$items.get(this.$indexes.get(index));
    }
    [$deleteByIndex](index) {
      const key = this.$indexes.get(index);
      this.$items.delete(key);
      this.$indexes.delete(index);
    }
    [$onEncodeEnd]() {
      this.deletedItems = {};
    }
    toArray() {
      return Array.from(this.$items.values());
    }
    toJSON() {
      const values = [];
      this.forEach((value, key) => {
        values.push(typeof value["toJSON"] === "function" ? value["toJSON"]() : value);
      });
      return values;
    }
    //
    // Decoding utilities
    //
    clone(isDecoding) {
      let cloned;
      if (isDecoding) {
        cloned = Object.assign(new _SetSchema(), this);
      } else {
        cloned = new _SetSchema();
        this.forEach((value) => {
          if (value[$changes]) {
            cloned.add(value["clone"]());
          } else {
            cloned.add(value);
          }
        });
      }
      return cloned;
    }
  };
  __publicField(_SetSchema, _b4, encodeKeyValueOperation);
  __publicField(_SetSchema, _a5, decodeKeyValueOperation);
  var SetSchema = _SetSchema;
  registerType("set", { constructor: SetSchema });
  var DEFAULT_VIEW_TAG = -1;
  function view(tag = DEFAULT_VIEW_TAG) {
    return function(target2, fieldName) {
      var _a7;
      const constructor = target2.constructor;
      const parentClass = Object.getPrototypeOf(constructor);
      const parentMetadata = parentClass[Symbol.metadata];
      const metadata = constructor[_a7 = Symbol.metadata] ?? (constructor[_a7] = Object.assign({}, constructor[Symbol.metadata], parentMetadata ?? /* @__PURE__ */ Object.create(null)));
      Metadata.setTag(metadata, fieldName, tag);
    };
  }
  function getPropertyDescriptor(fieldCached, fieldIndex, type, complexTypeKlass) {
    return {
      get: function() {
        return this[fieldCached];
      },
      set: function(value) {
        const previousValue = this[fieldCached] ?? void 0;
        if (value === previousValue) {
          return;
        }
        if (value !== void 0 && value !== null) {
          if (complexTypeKlass) {
            if (complexTypeKlass.constructor === ArraySchema && !(value instanceof ArraySchema)) {
              value = new ArraySchema(...value);
            }
            if (complexTypeKlass.constructor === MapSchema && !(value instanceof MapSchema)) {
              value = new MapSchema(value);
            }
            value[$childType] = type;
          } else if (typeof type !== "string") {
            assertInstanceType(value, type, this, fieldCached.substring(1));
          } else {
            assertType(value, type, this, fieldCached.substring(1));
          }
          const changeTree = this[$changes];
          if (previousValue !== void 0 && previousValue[$changes]) {
            changeTree.root?.remove(previousValue[$changes]);
            this.constructor[$track](changeTree, fieldIndex, OPERATION.DELETE_AND_ADD);
          } else {
            this.constructor[$track](changeTree, fieldIndex, OPERATION.ADD);
          }
          value[$changes]?.setParent(this, changeTree.root, fieldIndex);
        } else if (previousValue !== void 0) {
          this[$changes].delete(fieldIndex);
        }
        this[fieldCached] = value;
      },
      enumerable: true,
      configurable: true
    };
  }
  function schema(fieldsAndMethods, name, inherits = Schema) {
    const fields = {};
    const methods = {};
    const defaultValues = {};
    const viewTagFields = {};
    for (let fieldName in fieldsAndMethods) {
      const value = fieldsAndMethods[fieldName];
      if (typeof value === "object") {
        if (value["view"] !== void 0) {
          viewTagFields[fieldName] = typeof value["view"] === "boolean" ? DEFAULT_VIEW_TAG : value["view"];
        }
        if (value["sync"] !== false) {
          fields[fieldName] = getNormalizedType(value);
        }
        if (!Object.prototype.hasOwnProperty.call(value, "default")) {
          if (Array.isArray(value) || value["array"] !== void 0) {
            defaultValues[fieldName] = new ArraySchema();
          } else if (value["map"] !== void 0) {
            defaultValues[fieldName] = new MapSchema();
          } else if (value["collection"] !== void 0) {
            defaultValues[fieldName] = new CollectionSchema();
          } else if (value["set"] !== void 0) {
            defaultValues[fieldName] = new SetSchema();
          } else if (value["type"] !== void 0 && Schema.is(value["type"])) {
            if (!value["type"].prototype.initialize || value["type"].prototype.initialize.length === 0) {
              defaultValues[fieldName] = new value["type"]();
            }
          }
        } else {
          defaultValues[fieldName] = value["default"];
        }
      } else if (typeof value === "function") {
        if (Schema.is(value)) {
          if (!value.prototype.initialize || value.prototype.initialize.length === 0) {
            defaultValues[fieldName] = new value();
          }
          fields[fieldName] = getNormalizedType(value);
        } else {
          methods[fieldName] = value;
        }
      } else {
        fields[fieldName] = getNormalizedType(value);
      }
    }
    const getDefaultValues = () => {
      const defaults = {};
      for (const fieldName in defaultValues) {
        const defaultValue = defaultValues[fieldName];
        if (defaultValue && typeof defaultValue.clone === "function") {
          defaults[fieldName] = defaultValue.clone();
        } else {
          defaults[fieldName] = defaultValue;
        }
      }
      return defaults;
    };
    const getParentProps = (props) => {
      const fieldNames = Object.keys(fields);
      const parentProps = {};
      for (const key in props) {
        if (!fieldNames.includes(key)) {
          parentProps[key] = props[key];
        }
      }
      return parentProps;
    };
    const klass = Metadata.setFields(class extends inherits {
      constructor(...args) {
        if (methods.initialize && typeof methods.initialize === "function") {
          super(Object.assign({}, getDefaultValues(), getParentProps(args[0] || {})));
          if (new.target === klass) {
            methods.initialize.apply(this, args);
          }
        } else {
          super(Object.assign({}, getDefaultValues(), args[0] || {}));
        }
      }
    }, fields);
    klass._getDefaultValues = getDefaultValues;
    Object.assign(klass.prototype, methods);
    for (let fieldName in viewTagFields) {
      view(viewTagFields[fieldName])(klass.prototype, fieldName);
    }
    if (name) {
      Object.defineProperty(klass, "name", { value: name });
    }
    klass.extends = (fields2, name2) => schema(fields2, name2, klass);
    return klass;
  }
  function getIndent(level) {
    return new Array(level).fill(0).map((_2, i2) => i2 === level - 1 ? `\u2514\u2500 ` : `   `).join("");
  }
  var _a6, _b5, _c6, _d6;
  var _Schema = class _Schema {
    // allow inherited classes to have a constructor
    constructor(arg) {
      __publicField(this, _a6);
      _Schema.initialize(this);
      if (arg) {
        Object.assign(this, arg);
      }
    }
    /**
     * Assign the property descriptors required to track changes on this instance.
     * @param instance
     */
    static initialize(instance) {
      Object.defineProperty(instance, $changes, {
        value: new ChangeTree(instance),
        enumerable: false,
        writable: true
      });
      Object.defineProperties(instance, instance.constructor[Symbol.metadata]?.[$descriptors] || {});
    }
    static is(type) {
      return typeof type[Symbol.metadata] === "object";
    }
    /**
     * Check if a value is an instance of Schema.
     * This method uses duck-typing to avoid issues with multiple @colyseus/schema versions.
     * @param obj Value to check
     * @returns true if the value is a Schema instance
     */
    static isSchema(obj) {
      return typeof obj?.assign === "function";
    }
    /**
     * Track property changes
     */
    static [(_d6 = Symbol.metadata, _c6 = $encoder, _b5 = $decoder, _a6 = $refId, $track)](changeTree, index, operation = OPERATION.ADD) {
      changeTree.change(index, operation);
    }
    /**
     * Determine if a property must be filtered.
     * - If returns false, the property is NOT going to be encoded.
     * - If returns true, the property is going to be encoded.
     *
     * Encoding with "filters" happens in two steps:
     * - First, the encoder iterates over all "not owned" properties and encodes them.
     * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
     */
    static [$filter](ref, index, view2) {
      const metadata = ref.constructor[Symbol.metadata];
      const tag = metadata[index]?.tag;
      if (view2 === void 0) {
        return tag === void 0;
      } else if (tag === void 0) {
        return true;
      } else if (tag === DEFAULT_VIEW_TAG) {
        return view2.isChangeTreeVisible(ref[$changes]);
      } else {
        const tags = view2.tags?.get(ref[$changes]);
        return tags != null && (tag & tags) !== 0;
      }
    }
    /**
     * Assign properties to the instance.
     * @param props Properties to assign to the instance
     * @returns
     */
    assign(props) {
      Object.assign(this, props);
      return this;
    }
    /**
     * Restore the instance from JSON data.
     * @param jsonData JSON data to restore the instance from
     * @returns
     */
    restore(jsonData) {
      const metadata = this.constructor[Symbol.metadata];
      for (const fieldIndex in metadata) {
        const field = metadata[fieldIndex];
        const fieldName = field.name;
        const fieldType = field.type;
        const value = jsonData[fieldName];
        if (value === void 0 || value === null) {
          continue;
        }
        if (typeof fieldType === "string") {
          this[fieldName] = value;
        } else if (_Schema.is(fieldType)) {
          const instance = new fieldType();
          instance.restore(value);
          this[fieldName] = instance;
        } else if (typeof fieldType === "object") {
          const collectionType = Object.keys(fieldType)[0];
          const childType = fieldType[collectionType];
          if (collectionType === "map") {
            const mapSchema = this[fieldName];
            for (const key in value) {
              if (_Schema.is(childType)) {
                const childInstance = new childType();
                childInstance.restore(value[key]);
                mapSchema.set(key, childInstance);
              } else {
                mapSchema.set(key, value[key]);
              }
            }
          } else if (collectionType === "array") {
            const arraySchema = this[fieldName];
            for (let i2 = 0; i2 < value.length; i2++) {
              if (_Schema.is(childType)) {
                const childInstance = new childType();
                childInstance.restore(value[i2]);
                arraySchema.push(childInstance);
              } else {
                arraySchema.push(value[i2]);
              }
            }
          }
        }
      }
      return this;
    }
    /**
     * (Server-side): Flag a property to be encoded for the next patch.
     * @param instance Schema instance
     * @param property string representing the property name, or number representing the index of the property.
     * @param operation OPERATION to perform (detected automatically)
     */
    setDirty(property, operation) {
      const metadata = this.constructor[Symbol.metadata];
      this[$changes].change(metadata[metadata[property]].index, operation);
    }
    clone() {
      const cloned = Object.create(this.constructor.prototype);
      _Schema.initialize(cloned);
      const metadata = this.constructor[Symbol.metadata];
      for (const fieldIndex in metadata) {
        const field = metadata[fieldIndex].name;
        if (typeof this[field] === "object" && typeof this[field]?.clone === "function") {
          cloned[field] = this[field].clone();
        } else {
          cloned[field] = this[field];
        }
      }
      return cloned;
    }
    toJSON() {
      const obj = {};
      const metadata = this.constructor[Symbol.metadata];
      for (const index in metadata) {
        const field = metadata[index];
        const fieldName = field.name;
        if (!field.deprecated && this[fieldName] !== null && typeof this[fieldName] !== "undefined") {
          obj[fieldName] = typeof this[fieldName]["toJSON"] === "function" ? this[fieldName]["toJSON"]() : this[fieldName];
        }
      }
      return obj;
    }
    /**
     * Used in tests only
     * @internal
     */
    discardAllChanges() {
      this[$changes].discardAll();
    }
    [$getByIndex](index) {
      const metadata = this.constructor[Symbol.metadata];
      return this[metadata[index].name];
    }
    [$deleteByIndex](index) {
      const metadata = this.constructor[Symbol.metadata];
      this[metadata[index].name] = void 0;
    }
    /**
     * Inspect the `refId` of all Schema instances in the tree. Optionally display the contents of the instance.
     *
     * @param ref Schema instance
     * @param showContents display JSON contents of the instance
     * @returns
     */
    static debugRefIds(ref, showContents = false, level = 0, decoder2, keyPrefix = "") {
      const contents = showContents ? ` - ${JSON.stringify(ref.toJSON())}` : "";
      const changeTree = ref[$changes];
      const refId = ref[$refId];
      const root = decoder2 ? decoder2.root : changeTree.root;
      const refCount = root?.refCount?.[refId] > 1 ? ` [\xD7${root.refCount[refId]}]` : "";
      let output = `${getIndent(level)}${keyPrefix}${ref.constructor.name} (refId: ${refId})${refCount}${contents}
`;
      changeTree.forEachChild((childChangeTree, indexOrKey) => {
        let key = indexOrKey;
        if (typeof indexOrKey === "number" && ref["$indexes"]) {
          key = ref["$indexes"].get(indexOrKey) ?? indexOrKey;
        }
        const keyPrefix2 = ref["forEach"] !== void 0 && key !== void 0 ? `["${key}"]: ` : "";
        output += this.debugRefIds(childChangeTree.ref, showContents, level + 1, decoder2, keyPrefix2);
      });
      return output;
    }
    static debugRefIdEncodingOrder(ref, changeSet = "allChanges") {
      let encodeOrder = [];
      let current = ref[$changes].root[changeSet].next;
      while (current) {
        if (current.changeTree) {
          encodeOrder.push(current.changeTree.ref[$refId]);
        }
        current = current.next;
      }
      return encodeOrder;
    }
    static debugRefIdsFromDecoder(decoder2) {
      return this.debugRefIds(decoder2.state, false, 0, decoder2);
    }
    /**
     * Return a string representation of the changes on a Schema instance.
     * The list of changes is cleared after each encode.
     *
     * @param instance Schema instance
     * @param isEncodeAll Return "full encode" instead of current change set.
     * @returns
     */
    static debugChanges(instance, isEncodeAll = false) {
      const changeTree = instance[$changes];
      const changeSet = isEncodeAll ? changeTree.allChanges : changeTree.changes;
      const changeSetName = isEncodeAll ? "allChanges" : "changes";
      let output = `${instance.constructor.name} (${instance[$refId]}) -> .${changeSetName}:
`;
      function dumpChangeSet(changeSet2) {
        changeSet2.operations.filter((op2) => op2).forEach((index) => {
          const operation = changeTree.indexedOperations[index];
          output += `- [${index}]: ${OPERATION[operation]} (${JSON.stringify(changeTree.getValue(Number(index), isEncodeAll))})
`;
        });
      }
      dumpChangeSet(changeSet);
      if (!isEncodeAll && changeTree.filteredChanges && changeTree.filteredChanges.operations.filter((op2) => op2).length > 0) {
        output += `${instance.constructor.name} (${instance[$refId]}) -> .filteredChanges:
`;
        dumpChangeSet(changeTree.filteredChanges);
      }
      if (isEncodeAll && changeTree.allFilteredChanges && changeTree.allFilteredChanges.operations.filter((op2) => op2).length > 0) {
        output += `${instance.constructor.name} (${instance[$refId]}) -> .allFilteredChanges:
`;
        dumpChangeSet(changeTree.allFilteredChanges);
      }
      return output;
    }
    static debugChangesDeep(ref, changeSetName = "changes") {
      let output = "";
      const rootChangeTree = ref[$changes];
      const root = rootChangeTree.root;
      const changeTrees = /* @__PURE__ */ new Map();
      const instanceRefIds = [];
      let totalOperations = 0;
      for (const [refId, changes] of Object.entries(root[changeSetName])) {
        const changeTree = root.changeTrees[refId];
        if (!changeTree) {
          continue;
        }
        let includeChangeTree = false;
        let parentChangeTrees = [];
        let parentChangeTree = changeTree.parent?.[$changes];
        if (changeTree === rootChangeTree) {
          includeChangeTree = true;
        } else {
          while (parentChangeTree !== void 0) {
            parentChangeTrees.push(parentChangeTree);
            if (parentChangeTree.ref === ref) {
              includeChangeTree = true;
              break;
            }
            parentChangeTree = parentChangeTree.parent?.[$changes];
          }
        }
        if (includeChangeTree) {
          instanceRefIds.push(changeTree.ref[$refId]);
          totalOperations += Object.keys(changes).length;
          changeTrees.set(changeTree, parentChangeTrees.reverse());
        }
      }
      output += "---\n";
      output += `root refId: ${rootChangeTree.ref[$refId]}
`;
      output += `Total instances: ${instanceRefIds.length} (refIds: ${instanceRefIds.join(", ")})
`;
      output += `Total changes: ${totalOperations}
`;
      output += "---\n";
      const visitedParents = /* @__PURE__ */ new WeakSet();
      for (const [changeTree, parentChangeTrees] of changeTrees.entries()) {
        parentChangeTrees.forEach((parentChangeTree, level2) => {
          if (!visitedParents.has(parentChangeTree)) {
            output += `${getIndent(level2)}${parentChangeTree.ref.constructor.name} (refId: ${parentChangeTree.ref[$refId]})
`;
            visitedParents.add(parentChangeTree);
          }
        });
        const changes = changeTree.indexedOperations;
        const level = parentChangeTrees.length;
        const indent = getIndent(level);
        const parentIndex = level > 0 ? `(${changeTree.parentIndex}) ` : "";
        output += `${indent}${parentIndex}${changeTree.ref.constructor.name} (refId: ${changeTree.ref[$refId]}) - changes: ${Object.keys(changes).length}
`;
        for (const index in changes) {
          const operation = changes[index];
          output += `${getIndent(level + 1)}${OPERATION[operation]}: ${index}
`;
        }
      }
      return `${output}`;
    }
  };
  __publicField(_Schema, _d6);
  __publicField(_Schema, _c6, encodeSchemaOperation);
  __publicField(_Schema, _b5, decodeSchemaOperation);
  var Schema = _Schema;
  var Root = class {
    // TODO: do not initialize it if filters are not used
    constructor(types) {
      __publicField(this, "types");
      __publicField(this, "nextUniqueId", 0);
      __publicField(this, "refCount", {});
      __publicField(this, "changeTrees", {});
      // all changes
      __publicField(this, "allChanges", createChangeTreeList());
      __publicField(this, "allFilteredChanges", createChangeTreeList());
      // TODO: do not initialize it if filters are not used
      // pending changes to be encoded
      __publicField(this, "changes", createChangeTreeList());
      __publicField(this, "filteredChanges", createChangeTreeList());
      this.types = types;
    }
    getNextUniqueId() {
      return this.nextUniqueId++;
    }
    add(changeTree) {
      const ref = changeTree.ref;
      if (ref[$refId] === void 0) {
        Object.defineProperty(ref, $refId, {
          value: this.getNextUniqueId(),
          enumerable: false,
          writable: true
        });
      }
      const refId = ref[$refId];
      const isNewChangeTree = this.changeTrees[refId] === void 0;
      if (isNewChangeTree) {
        this.changeTrees[refId] = changeTree;
      }
      const previousRefCount = this.refCount[refId];
      if (previousRefCount === 0) {
        const ops = changeTree.allChanges.operations;
        let len = ops.length;
        while (len--) {
          changeTree.indexedOperations[ops[len]] = OPERATION.ADD;
          setOperationAtIndex(changeTree.changes, len);
        }
      }
      this.refCount[refId] = (previousRefCount || 0) + 1;
      return isNewChangeTree;
    }
    remove(changeTree) {
      const refId = changeTree.ref[$refId];
      const refCount = this.refCount[refId] - 1;
      if (refCount <= 0) {
        changeTree.root = void 0;
        delete this.changeTrees[refId];
        this.removeChangeFromChangeSet("allChanges", changeTree);
        this.removeChangeFromChangeSet("changes", changeTree);
        if (changeTree.filteredChanges) {
          this.removeChangeFromChangeSet("allFilteredChanges", changeTree);
          this.removeChangeFromChangeSet("filteredChanges", changeTree);
        }
        this.refCount[refId] = 0;
        changeTree.forEachChild((child, _2) => {
          if (child.removeParent(changeTree.ref)) {
            if (child.parentChain === void 0 || // no parent, remove it
            child.parentChain && this.refCount[child.ref[$refId]] > 0) {
              this.remove(child);
            } else if (child.parentChain) {
              this.moveNextToParent(child);
            }
          }
        });
      } else {
        this.refCount[refId] = refCount;
        this.recursivelyMoveNextToParent(changeTree);
      }
      return refCount;
    }
    recursivelyMoveNextToParent(changeTree) {
      this.moveNextToParent(changeTree);
      changeTree.forEachChild((child, _2) => this.recursivelyMoveNextToParent(child));
    }
    moveNextToParent(changeTree) {
      if (changeTree.filteredChanges) {
        this.moveNextToParentInChangeTreeList("filteredChanges", changeTree);
        this.moveNextToParentInChangeTreeList("allFilteredChanges", changeTree);
      } else {
        this.moveNextToParentInChangeTreeList("changes", changeTree);
        this.moveNextToParentInChangeTreeList("allChanges", changeTree);
      }
    }
    moveNextToParentInChangeTreeList(changeSetName, changeTree) {
      const changeSet = this[changeSetName];
      const node = changeTree[changeSetName].queueRootNode;
      if (!node)
        return;
      const parent = changeTree.parent;
      if (!parent || !parent[$changes])
        return;
      const parentNode = parent[$changes][changeSetName]?.queueRootNode;
      if (!parentNode || parentNode === node)
        return;
      const parentPosition = parentNode.position;
      const childPosition = node.position;
      if (childPosition > parentPosition)
        return;
      if (node.prev) {
        node.prev.next = node.next;
      } else {
        changeSet.next = node.next;
      }
      if (node.next) {
        node.next.prev = node.prev;
      } else {
        changeSet.tail = node.prev;
      }
      node.prev = parentNode;
      node.next = parentNode.next;
      if (parentNode.next) {
        parentNode.next.prev = node;
      } else {
        changeSet.tail = node;
      }
      parentNode.next = node;
      this.updatePositionsAfterMove(changeSet, node, parentPosition + 1);
    }
    enqueueChangeTree(changeTree, changeSet, queueRootNode = changeTree[changeSet].queueRootNode) {
      if (queueRootNode) {
        return;
      }
      changeTree[changeSet].queueRootNode = this.addToChangeTreeList(this[changeSet], changeTree);
    }
    addToChangeTreeList(list, changeTree) {
      const node = {
        changeTree,
        next: void 0,
        prev: void 0,
        position: list.tail ? list.tail.position + 1 : 0
      };
      if (!list.next) {
        list.next = node;
        list.tail = node;
      } else {
        node.prev = list.tail;
        list.tail.next = node;
        list.tail = node;
      }
      return node;
    }
    updatePositionsAfterRemoval(list, removedPosition) {
      let current = list.next;
      let position3 = 0;
      while (current) {
        if (position3 >= removedPosition) {
          current.position = position3;
        }
        current = current.next;
        position3++;
      }
    }
    updatePositionsAfterMove(list, node, newPosition) {
      let current = list.next;
      let position3 = 0;
      while (current) {
        current.position = position3;
        current = current.next;
        position3++;
      }
    }
    removeChangeFromChangeSet(changeSetName, changeTree) {
      const changeSet = this[changeSetName];
      const node = changeTree[changeSetName].queueRootNode;
      if (node && node.changeTree === changeTree) {
        const removedPosition = node.position;
        if (node.prev) {
          node.prev.next = node.next;
        } else {
          changeSet.next = node.next;
        }
        if (node.next) {
          node.next.prev = node.prev;
        } else {
          changeSet.tail = node.prev;
        }
        this.updatePositionsAfterRemoval(changeSet, removedPosition);
        changeTree[changeSetName].queueRootNode = void 0;
        return true;
      }
      return false;
    }
  };
  function concatBytes(a2, b2) {
    const result = new Uint8Array(a2.length + b2.length);
    result.set(a2, 0);
    result.set(b2, a2.length);
    return result;
  }
  var _Encoder = class _Encoder {
    constructor(state) {
      // 8KB
      __publicField(this, "sharedBuffer", new Uint8Array(_Encoder.BUFFER_SIZE));
      __publicField(this, "context");
      __publicField(this, "state");
      __publicField(this, "root");
      this.context = TypeContext.cache(state.constructor);
      this.root = new Root(this.context);
      this.setState(state);
    }
    setState(state) {
      this.state = state;
      this.state[$changes].setRoot(this.root);
    }
    encode(it2 = { offset: 0 }, view2, buffer = this.sharedBuffer, changeSetName = "changes", isEncodeAll = changeSetName === "allChanges", initialOffset = it2.offset) {
      const hasView = view2 !== void 0;
      const rootChangeTree = this.state[$changes];
      let current = this.root[changeSetName];
      while (current = current.next) {
        const changeTree = current.changeTree;
        if (hasView) {
          if (!view2.isChangeTreeVisible(changeTree)) {
            view2.invisible.add(changeTree);
            continue;
          }
          view2.invisible.delete(changeTree);
        }
        const changeSet = changeTree[changeSetName];
        const ref = changeTree.ref;
        const numChanges = changeSet.operations.length;
        if (numChanges === 0) {
          continue;
        }
        const ctor = ref.constructor;
        const encoder = ctor[$encoder];
        const filter = ctor[$filter];
        const metadata = ctor[Symbol.metadata];
        if (hasView || it2.offset > initialOffset || changeTree !== rootChangeTree) {
          buffer[it2.offset++] = SWITCH_TO_STRUCTURE & 255;
          encode.number(buffer, ref[$refId], it2);
        }
        for (let j2 = 0; j2 < numChanges; j2++) {
          const fieldIndex = changeSet.operations[j2];
          if (fieldIndex < 0) {
            buffer[it2.offset++] = Math.abs(fieldIndex) & 255;
            continue;
          }
          const operation = isEncodeAll ? OPERATION.ADD : changeTree.indexedOperations[fieldIndex];
          if (fieldIndex === void 0 || operation === void 0 || filter && !filter(ref, fieldIndex, view2)) {
            continue;
          }
          encoder(this, buffer, changeTree, fieldIndex, operation, it2, isEncodeAll, hasView, metadata);
        }
      }
      if (it2.offset > buffer.byteLength) {
        const newSize = Math.ceil(it2.offset / _Encoder.BUFFER_SIZE) * _Encoder.BUFFER_SIZE;
        console.warn(`@colyseus/schema buffer overflow. Encoded state is higher than default BUFFER_SIZE. Use the following to increase default BUFFER_SIZE:

    import { Encoder } from "@colyseus/schema";
    Encoder.BUFFER_SIZE = ${Math.round(newSize / 1024)} * 1024; // ${Math.round(newSize / 1024)} KB
`);
        const newBuffer = new Uint8Array(newSize);
        newBuffer.set(buffer);
        buffer = newBuffer;
        if (buffer === this.sharedBuffer) {
          this.sharedBuffer = buffer;
        }
        return this.encode({ offset: initialOffset }, view2, buffer, changeSetName, isEncodeAll);
      } else {
        return buffer.subarray(0, it2.offset);
      }
    }
    encodeAll(it2 = { offset: 0 }, buffer = this.sharedBuffer) {
      return this.encode(it2, void 0, buffer, "allChanges", true);
    }
    encodeAllView(view2, sharedOffset, it2, bytes = this.sharedBuffer) {
      const viewOffset = it2.offset;
      this.encode(it2, view2, bytes, "allFilteredChanges", true, viewOffset);
      return concatBytes(bytes.subarray(0, sharedOffset), bytes.subarray(viewOffset, it2.offset));
    }
    encodeView(view2, sharedOffset, it2, bytes = this.sharedBuffer) {
      const viewOffset = it2.offset;
      const orderedRefIds = view2.changesOutOfOrder ? this.topoOrderViewChanges(view2) : view2.changes.keys();
      for (const refId of orderedRefIds) {
        const changes = view2.changes.get(refId);
        const changeTree = this.root.changeTrees[refId];
        if (changeTree === void 0) {
          view2.changes.delete(refId);
          continue;
        }
        const keys = Object.keys(changes);
        if (keys.length === 0) {
          continue;
        }
        const ref = changeTree.ref;
        const ctor = ref.constructor;
        const encoder = ctor[$encoder];
        const metadata = ctor[Symbol.metadata];
        bytes[it2.offset++] = SWITCH_TO_STRUCTURE & 255;
        encode.number(bytes, ref[$refId], it2);
        for (let i2 = 0, numChanges = keys.length; i2 < numChanges; i2++) {
          const index = Number(keys[i2]);
          const value = changeTree.ref[$getByIndex](index);
          const operation = value !== void 0 && changes[index] || OPERATION.DELETE;
          encoder(this, bytes, changeTree, index, operation, it2, false, true, metadata);
        }
      }
      view2.changes.clear();
      view2.changesOutOfOrder = false;
      this.encode(it2, view2, bytes, "filteredChanges", false, viewOffset);
      return concatBytes(bytes.subarray(0, sharedOffset), bytes.subarray(viewOffset, it2.offset));
    }
    /**
     * Produce a topological ordering of `view.changes` keys so each refId
     * is preceded by any ancestor that's also in the same view's changeset.
     *
     * The wire stream uses SWITCH_TO_STRUCTURE pointers; if a child is
     * encoded before any earlier op has introduced its refId on the
     * decoder, decode fails with "refId not found". An entry's refId can
     * only be introduced by an ADD on one of its ancestors — so any
     * ancestor that itself appears in this view's pending changes must
     * be encoded first.
     *
     * Implementation: DFS post-order over the parent chain. The `visited`
     * Set guards against duplicates; cycles are not expected in a
     * well-formed parent chain but the visited check is a cheap safety
     * net. Cost is O(n × d) for n entries with parent-chain depth d.
     */
    topoOrderViewChanges(view2) {
      const result = [];
      const visited = /* @__PURE__ */ new Set();
      const visit = (refId) => {
        if (visited.has(refId)) {
          return;
        }
        visited.add(refId);
        const changeTree = this.root.changeTrees[refId];
        if (changeTree !== void 0) {
          let chain = changeTree.parentChain;
          while (chain) {
            const parentRefId = chain.ref[$refId];
            if (parentRefId !== void 0 && view2.changes.has(parentRefId)) {
              visit(parentRefId);
            }
            chain = chain.next;
          }
        }
        result.push(refId);
      };
      for (const refId of view2.changes.keys()) {
        visit(refId);
      }
      return result;
    }
    discardChanges() {
      let current = this.root.changes.next;
      while (current) {
        current.changeTree.endEncode("changes");
        current = current.next;
      }
      this.root.changes = createChangeTreeList();
      current = this.root.filteredChanges.next;
      while (current) {
        current.changeTree.endEncode("filteredChanges");
        current = current.next;
      }
      this.root.filteredChanges = createChangeTreeList();
    }
    tryEncodeTypeId(bytes, baseType, targetType, it2) {
      const baseTypeId = this.context.getTypeId(baseType);
      const targetTypeId = this.context.getTypeId(targetType);
      if (targetTypeId === void 0) {
        console.warn(`@colyseus/schema WARNING: Class "${targetType.name}" is not registered on TypeRegistry - Please either tag the class with @entity or define a @type() field.`);
        return;
      }
      if (baseTypeId !== targetTypeId) {
        bytes[it2.offset++] = TYPE_ID & 255;
        encode.number(bytes, targetTypeId, it2);
      }
    }
    get hasChanges() {
      return this.root.changes.next !== void 0 || this.root.filteredChanges.next !== void 0;
    }
  };
  __publicField(_Encoder, "BUFFER_SIZE", 8 * 1024);
  var Encoder = _Encoder;
  function spliceOne(arr, index) {
    if (index === -1 || index >= arr.length) {
      return false;
    }
    const len = arr.length - 1;
    for (let i2 = index; i2 < len; i2++) {
      arr[i2] = arr[i2 + 1];
    }
    arr.length = len;
    return true;
  }
  var DecodingWarning = class extends Error {
    constructor(message) {
      super(message);
      this.name = "DecodingWarning";
    }
  };
  var ReferenceTracker = class {
    constructor() {
      //
      // Relation of refId => Schema structure
      // For direct access of structures during decoding time.
      //
      __publicField(this, "refs", /* @__PURE__ */ new Map());
      __publicField(this, "refCount", {});
      __publicField(this, "deletedRefs", /* @__PURE__ */ new Set());
      __publicField(this, "callbacks", {});
      __publicField(this, "nextUniqueId", 0);
    }
    getNextUniqueId() {
      return this.nextUniqueId++;
    }
    // for decoding
    addRef(refId, ref, incrementCount = true) {
      this.refs.set(refId, ref);
      Object.defineProperty(ref, $refId, {
        value: refId,
        enumerable: false,
        writable: true
      });
      if (incrementCount) {
        this.refCount[refId] = (this.refCount[refId] || 0) + 1;
      }
      if (this.deletedRefs.has(refId)) {
        this.deletedRefs.delete(refId);
      }
    }
    // for decoding
    removeRef(refId) {
      const refCount = this.refCount[refId];
      if (refCount === void 0) {
        try {
          throw new DecodingWarning("trying to remove refId that doesn't exist: " + refId);
        } catch (e2) {
          console.warn(e2);
        }
        return;
      }
      if (refCount === 0) {
        try {
          const ref = this.refs.get(refId);
          throw new DecodingWarning(`trying to remove refId '${refId}' with 0 refCount (${ref.constructor.name}: ${JSON.stringify(ref)})`);
        } catch (e2) {
          console.warn(e2);
        }
        return;
      }
      if ((this.refCount[refId] = refCount - 1) <= 0) {
        this.deletedRefs.add(refId);
      }
    }
    clearRefs() {
      this.refs.clear();
      this.deletedRefs.clear();
      this.callbacks = {};
      this.refCount = {};
    }
    // for decoding
    garbageCollectDeletedRefs() {
      this.deletedRefs.forEach((refId) => {
        if (this.refCount[refId] > 0) {
          return;
        }
        const ref = this.refs.get(refId);
        if (ref.constructor[Symbol.metadata] !== void 0) {
          const metadata = ref.constructor[Symbol.metadata];
          for (const index in metadata) {
            const field = metadata[index].name;
            const child = ref[field];
            if (typeof child === "object" && child) {
              const childRefId = child[$refId];
              if (childRefId !== void 0 && !this.deletedRefs.has(childRefId)) {
                this.removeRef(childRefId);
              }
            }
          }
        } else {
          if (typeof ref[$childType] === "function") {
            Array.from(ref.values()).forEach((child) => {
              const childRefId = child[$refId];
              if (childRefId !== void 0 && !this.deletedRefs.has(childRefId)) {
                this.removeRef(childRefId);
              }
            });
          }
        }
        this.refs.delete(refId);
        delete this.refCount[refId];
        delete this.callbacks[refId];
      });
      this.deletedRefs.clear();
    }
    addCallback(refId, fieldOrOperation, callback) {
      if (refId === void 0) {
        const name = typeof fieldOrOperation === "number" ? OPERATION[fieldOrOperation] : fieldOrOperation;
        throw new Error(`Can't addCallback on '${name}' (refId is undefined)`);
      }
      if (!this.callbacks[refId]) {
        this.callbacks[refId] = {};
      }
      if (!this.callbacks[refId][fieldOrOperation]) {
        this.callbacks[refId][fieldOrOperation] = [];
      }
      this.callbacks[refId][fieldOrOperation].push(callback);
      return () => this.removeCallback(refId, fieldOrOperation, callback);
    }
    removeCallback(refId, field, callback) {
      const index = this.callbacks?.[refId]?.[field]?.indexOf(callback);
      if (index !== void 0 && index !== -1) {
        spliceOne(this.callbacks[refId][field], index);
      }
    }
  };
  var Decoder = class {
    constructor(root, context) {
      __publicField(this, "context");
      __publicField(this, "state");
      __publicField(this, "root");
      __publicField(this, "currentRefId", 0);
      __publicField(this, "triggerChanges");
      this.setState(root);
      this.context = context || new TypeContext(root.constructor);
    }
    setState(root) {
      this.state = root;
      this.root = new ReferenceTracker();
      this.root.addRef(0, root);
    }
    decode(bytes, it2 = { offset: 0 }, ref = this.state) {
      const allChanges = [];
      const $root = this.root;
      const totalBytes = bytes.byteLength;
      let decoder2 = ref["constructor"][$decoder];
      this.currentRefId = 0;
      while (it2.offset < totalBytes) {
        if (bytes[it2.offset] == SWITCH_TO_STRUCTURE) {
          it2.offset++;
          ref[$onDecodeEnd]?.();
          const nextRefId = decode.number(bytes, it2);
          const nextRef = $root.refs.get(nextRefId);
          if (!nextRef) {
            console.error(`"refId" not found: ${nextRefId}`, { previousRef: ref, previousRefId: this.currentRefId });
            console.warn("Please report this issue to the developers.");
            this.skipCurrentStructure(bytes, it2, totalBytes);
          } else {
            ref = nextRef;
            decoder2 = ref.constructor[$decoder];
            this.currentRefId = nextRefId;
          }
          continue;
        }
        const result = decoder2(this, bytes, it2, ref, allChanges);
        if (result === DEFINITION_MISMATCH) {
          console.warn("@colyseus/schema: definition mismatch");
          this.skipCurrentStructure(bytes, it2, totalBytes);
          continue;
        }
      }
      ref[$onDecodeEnd]?.();
      this.triggerChanges?.(allChanges);
      $root.garbageCollectDeletedRefs();
      return allChanges;
    }
    skipCurrentStructure(bytes, it2, totalBytes) {
      const nextIterator = { offset: it2.offset };
      while (it2.offset < totalBytes) {
        if (bytes[it2.offset] === SWITCH_TO_STRUCTURE) {
          nextIterator.offset = it2.offset + 1;
          if (this.root.refs.has(decode.number(bytes, nextIterator))) {
            break;
          }
        }
        it2.offset++;
      }
    }
    getInstanceType(bytes, it2, defaultType) {
      let type;
      if (bytes[it2.offset] === TYPE_ID) {
        it2.offset++;
        const type_id = decode.number(bytes, it2);
        type = this.context.get(type_id);
      }
      return type || defaultType;
    }
    createInstanceOfType(type) {
      return new type();
    }
    removeChildRefs(ref, allChanges) {
      const needRemoveRef = typeof ref[$childType] !== "string";
      const refId = ref[$refId];
      ref.forEach((value, key) => {
        allChanges.push({
          ref,
          refId,
          op: OPERATION.DELETE,
          field: key,
          value: void 0,
          previousValue: value
        });
        if (needRemoveRef) {
          this.root.removeRef(value[$refId]);
        }
      });
    }
  };
  var ReflectionField = schema({
    name: "string",
    type: "string",
    referencedType: "number"
  });
  var ReflectionType = schema({
    id: "number",
    extendsId: "number",
    fields: [ReflectionField]
  });
  var Reflection = schema({
    types: [ReflectionType],
    rootType: "number"
  });
  Reflection.encode = function(encoder, it2 = { offset: 0 }) {
    const context = encoder.context;
    const reflection = new Reflection();
    const reflectionEncoder = new Encoder(reflection);
    const rootType = context.schemas.get(encoder.state.constructor);
    if (rootType > 0) {
      reflection.rootType = rootType;
    }
    const includedTypeIds = /* @__PURE__ */ new Set();
    const pendingReflectionTypes = {};
    const addType = (type) => {
      if (type.extendsId === void 0 || includedTypeIds.has(type.extendsId)) {
        includedTypeIds.add(type.id);
        reflection.types.push(type);
        const deps = pendingReflectionTypes[type.id];
        if (deps !== void 0) {
          delete pendingReflectionTypes[type.id];
          deps.forEach((childType) => addType(childType));
        }
      } else {
        if (pendingReflectionTypes[type.extendsId] === void 0) {
          pendingReflectionTypes[type.extendsId] = [];
        }
        pendingReflectionTypes[type.extendsId].push(type);
      }
    };
    context.schemas.forEach((typeid, klass) => {
      const type = new ReflectionType();
      type.id = Number(typeid);
      const inheritFrom = Object.getPrototypeOf(klass);
      if (inheritFrom !== Schema) {
        type.extendsId = context.schemas.get(inheritFrom);
      }
      const metadata = klass[Symbol.metadata];
      if (metadata !== inheritFrom[Symbol.metadata]) {
        for (const fieldIndex in metadata) {
          const index = Number(fieldIndex);
          const fieldName = metadata[index].name;
          if (!Object.prototype.hasOwnProperty.call(metadata, fieldName)) {
            continue;
          }
          const reflectionField = new ReflectionField();
          reflectionField.name = fieldName;
          let fieldType;
          const field = metadata[index];
          if (typeof field.type === "string") {
            fieldType = field.type;
          } else {
            let childTypeSchema;
            if (Schema.is(field.type)) {
              fieldType = "ref";
              childTypeSchema = field.type;
            } else {
              fieldType = Object.keys(field.type)[0];
              if (typeof field.type[fieldType] === "string") {
                fieldType += ":" + field.type[fieldType];
              } else {
                childTypeSchema = field.type[fieldType];
              }
            }
            reflectionField.referencedType = childTypeSchema ? context.getTypeId(childTypeSchema) : -1;
          }
          reflectionField.type = fieldType;
          type.fields.push(reflectionField);
        }
      }
      addType(type);
    });
    for (const typeid in pendingReflectionTypes) {
      pendingReflectionTypes[typeid].forEach((type) => reflection.types.push(type));
    }
    const buf = reflectionEncoder.encodeAll(it2);
    return buf.slice(0, it2.offset);
  };
  Reflection.decode = function(bytes, it2) {
    const reflection = new Reflection();
    const reflectionDecoder = new Decoder(reflection);
    reflectionDecoder.decode(bytes, it2);
    const typeContext = new TypeContext();
    reflection.types.forEach((reflectionType) => {
      const parentClass = typeContext.get(reflectionType.extendsId) ?? Schema;
      const schema2 = class _ extends parentClass {
      };
      TypeContext.register(schema2);
      typeContext.add(schema2, reflectionType.id);
    }, {});
    const addFields = (metadata, reflectionType, parentFieldIndex) => {
      reflectionType.fields.forEach((field, i2) => {
        const fieldIndex = parentFieldIndex + i2;
        if (field.referencedType !== void 0) {
          let fieldType = field.type;
          let refType = typeContext.get(field.referencedType);
          if (!refType) {
            const typeInfo = field.type.split(":");
            fieldType = typeInfo[0];
            refType = typeInfo[1];
          }
          if (fieldType === "ref") {
            Metadata.addField(metadata, fieldIndex, field.name, refType);
          } else {
            Metadata.addField(metadata, fieldIndex, field.name, { [fieldType]: refType });
          }
        } else {
          Metadata.addField(metadata, fieldIndex, field.name, field.type);
        }
      });
    };
    reflection.types.forEach((reflectionType) => {
      const schema2 = typeContext.get(reflectionType.id);
      const metadata = Metadata.initialize(schema2);
      const inheritedTypes = [];
      let parentType = reflectionType;
      do {
        inheritedTypes.push(parentType);
        parentType = reflection.types.find((t4) => t4.id === parentType.extendsId);
      } while (parentType);
      let parentFieldIndex = 0;
      inheritedTypes.reverse().forEach((reflectionType2) => {
        addFields(metadata, reflectionType2, parentFieldIndex);
        parentFieldIndex += reflectionType2.fields.length;
      });
    });
    const state = new (typeContext.get(reflection.rootType || 0))();
    return new Decoder(state, typeContext);
  };
  registerType("map", { constructor: MapSchema });
  registerType("array", { constructor: ArraySchema });
  registerType("set", { constructor: SetSchema });
  registerType("collection", { constructor: CollectionSchema });

  // ../../node_modules/.pnpm/@colyseus+msgpackr@1.11.3/node_modules/@colyseus/msgpackr/unpack.js
  var decoder;
  try {
    decoder = new TextDecoder();
  } catch (error) {
  }
  var src;
  var srcEnd;
  var position = 0;
  var EMPTY_ARRAY = [];
  var strings = EMPTY_ARRAY;
  var stringPosition = 0;
  var currentUnpackr = {};
  var currentStructures;
  var srcString;
  var srcStringStart = 0;
  var srcStringEnd = 0;
  var bundledStrings;
  var referenceMap;
  var currentExtensions = [];
  var dataView;
  var defaultOptions = {
    useRecords: false,
    mapsAsObjects: true
  };
  var C1Type = class {
  };
  var C1 = new C1Type();
  C1.name = "MessagePack 0xC1";
  var sequentialMode = false;
  var inlineObjectReadThreshold = 2;
  var readStruct;
  var onLoadedStructures;
  var onSaveState;
  try {
    new Function("");
  } catch (error) {
    inlineObjectReadThreshold = Infinity;
  }
  var Unpackr = class _Unpackr {
    constructor(options) {
      if (options) {
        if (options.useRecords === false && options.mapsAsObjects === void 0)
          options.mapsAsObjects = true;
        if (options.sequential && options.trusted !== false) {
          options.trusted = true;
          if (!options.structures && options.useRecords != false) {
            options.structures = [];
            if (!options.maxSharedStructures)
              options.maxSharedStructures = 0;
          }
        }
        if (options.structures)
          options.structures.sharedLength = options.structures.length;
        else if (options.getStructures) {
          (options.structures = []).uninitialized = true;
          options.structures.sharedLength = 0;
        }
        if (options.int64AsNumber) {
          options.int64AsType = "number";
        }
      }
      Object.assign(this, options);
    }
    unpack(source, options) {
      if (src) {
        return saveState(() => {
          clearSource();
          return this ? this.unpack(source, options) : _Unpackr.prototype.unpack.call(defaultOptions, source, options);
        });
      }
      if (!source.buffer && source.constructor === ArrayBuffer)
        source = typeof Buffer !== "undefined" ? Buffer.from(source) : new Uint8Array(source);
      if (typeof options === "object") {
        srcEnd = options.end || source.length;
        position = options.start || 0;
      } else {
        position = 0;
        srcEnd = options > -1 ? options : source.length;
      }
      stringPosition = 0;
      srcStringEnd = 0;
      srcString = null;
      strings = EMPTY_ARRAY;
      bundledStrings = null;
      src = source;
      try {
        dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
      } catch (error) {
        src = null;
        if (source instanceof Uint8Array)
          throw error;
        throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
      }
      if (this instanceof _Unpackr) {
        currentUnpackr = this;
        if (this.structures) {
          currentStructures = this.structures;
          return checkedRead(options);
        } else if (!currentStructures || currentStructures.length > 0) {
          currentStructures = [];
        }
      } else {
        currentUnpackr = defaultOptions;
        if (!currentStructures || currentStructures.length > 0)
          currentStructures = [];
      }
      return checkedRead(options);
    }
    unpackMultiple(source, forEach) {
      let values, lastPosition = 0;
      try {
        sequentialMode = true;
        let size = source.length;
        let value = this ? this.unpack(source, size) : defaultUnpackr.unpack(source, size);
        if (forEach) {
          if (forEach(value, lastPosition, position) === false) return;
          while (position < size) {
            lastPosition = position;
            if (forEach(checkedRead(), lastPosition, position) === false) {
              return;
            }
          }
        } else {
          values = [value];
          while (position < size) {
            lastPosition = position;
            values.push(checkedRead());
          }
          return values;
        }
      } catch (error) {
        error.lastPosition = lastPosition;
        error.values = values;
        throw error;
      } finally {
        sequentialMode = false;
        clearSource();
      }
    }
    _mergeStructures(loadedStructures, existingStructures) {
      if (onLoadedStructures)
        loadedStructures = onLoadedStructures.call(this, loadedStructures);
      loadedStructures = loadedStructures || [];
      if (Object.isFrozen(loadedStructures))
        loadedStructures = loadedStructures.map((structure) => structure.slice(0));
      for (let i2 = 0, l2 = loadedStructures.length; i2 < l2; i2++) {
        let structure = loadedStructures[i2];
        if (structure) {
          structure.isShared = true;
          if (i2 >= 32)
            structure.highByte = i2 - 32 >> 5;
        }
      }
      loadedStructures.sharedLength = loadedStructures.length;
      for (let id2 in existingStructures || []) {
        if (id2 >= 0) {
          let structure = loadedStructures[id2];
          let existing = existingStructures[id2];
          if (existing) {
            if (structure)
              (loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id2] = structure;
            loadedStructures[id2] = existing;
          }
        }
      }
      return this.structures = loadedStructures;
    }
    decode(source, options) {
      return this.unpack(source, options);
    }
  };
  function checkedRead(options) {
    try {
      if (!currentUnpackr.trusted && !sequentialMode) {
        let sharedLength = currentStructures.sharedLength || 0;
        if (sharedLength < currentStructures.length)
          currentStructures.length = sharedLength;
      }
      let result;
      if (currentUnpackr.randomAccessStructure && src[position] < 64 && src[position] >= 32 && readStruct) {
        result = readStruct(src, position, srcEnd, currentUnpackr);
        src = null;
        if (!(options && options.lazy) && result)
          result = result.toJSON();
        position = srcEnd;
      } else
        result = read();
      if (bundledStrings) {
        position = bundledStrings.postBundlePosition;
        bundledStrings = null;
      }
      if (sequentialMode)
        currentStructures.restoreStructures = null;
      if (position == srcEnd) {
        if (currentStructures && currentStructures.restoreStructures)
          restoreStructures();
        currentStructures = null;
        src = null;
        if (referenceMap)
          referenceMap = null;
      } else if (position > srcEnd) {
        throw new Error("Unexpected end of MessagePack data");
      } else if (!sequentialMode) {
        let jsonView;
        try {
          jsonView = JSON.stringify(result, (_2, value) => typeof value === "bigint" ? `${value}n` : value).slice(0, 100);
        } catch (error) {
          jsonView = "(JSON view not available " + error + ")";
        }
        throw new Error("Data read, but end of buffer not reached " + jsonView);
      }
      return result;
    } catch (error) {
      if (currentStructures && currentStructures.restoreStructures)
        restoreStructures();
      clearSource();
      if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer") || position > srcEnd) {
        error.incomplete = true;
      }
      throw error;
    }
  }
  function restoreStructures() {
    for (let id2 in currentStructures.restoreStructures) {
      currentStructures[id2] = currentStructures.restoreStructures[id2];
    }
    currentStructures.restoreStructures = null;
  }
  function read() {
    let token = src[position++];
    if (token < 160) {
      if (token < 128) {
        if (token < 64)
          return token;
        else {
          let structure = currentStructures[token & 63] || currentUnpackr.getStructures && loadStructures()[token & 63];
          if (structure) {
            if (!structure.read) {
              structure.read = createStructureReader(structure, token & 63);
            }
            return structure.read();
          } else
            return token;
        }
      } else if (token < 144) {
        token -= 128;
        if (currentUnpackr.mapsAsObjects) {
          let object = {};
          for (let i2 = 0; i2 < token; i2++) {
            let key = readKey();
            if (key === "__proto__")
              key = "__proto_";
            object[key] = read();
          }
          return object;
        } else {
          let map = /* @__PURE__ */ new Map();
          for (let i2 = 0; i2 < token; i2++) {
            map.set(read(), read());
          }
          return map;
        }
      } else {
        token -= 144;
        let array = new Array(token);
        for (let i2 = 0; i2 < token; i2++) {
          array[i2] = read();
        }
        if (currentUnpackr.freezeData)
          return Object.freeze(array);
        return array;
      }
    } else if (token < 192) {
      let length = token - 160;
      if (srcStringEnd >= position) {
        return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
      }
      if (srcStringEnd == 0 && srcEnd < 140) {
        let string2 = length < 16 ? shortStringInJS(length) : longStringInJS(length);
        if (string2 != null)
          return string2;
      }
      return readFixedString(length);
    } else {
      let value;
      switch (token) {
        case 192:
          return null;
        case 193:
          if (bundledStrings) {
            value = read();
            if (value > 0)
              return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value);
            else
              return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 -= value);
          }
          return C1;
        // "never-used", return special object to denote that
        case 194:
          return false;
        case 195:
          return true;
        case 196:
          value = src[position++];
          if (value === void 0)
            throw new Error("Unexpected end of buffer");
          return readBin(value);
        case 197:
          value = dataView.getUint16(position);
          position += 2;
          return readBin(value);
        case 198:
          value = dataView.getUint32(position);
          position += 4;
          return readBin(value);
        case 199:
          return readExt(src[position++]);
        case 200:
          value = dataView.getUint16(position);
          position += 2;
          return readExt(value);
        case 201:
          value = dataView.getUint32(position);
          position += 4;
          return readExt(value);
        case 202:
          value = dataView.getFloat32(position);
          if (currentUnpackr.useFloat32 > 2) {
            let multiplier = mult10[(src[position] & 127) << 1 | src[position + 1] >> 7];
            position += 4;
            return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
          }
          position += 4;
          return value;
        case 203:
          value = dataView.getFloat64(position);
          position += 8;
          return value;
        // uint handlers
        case 204:
          return src[position++];
        case 205:
          value = dataView.getUint16(position);
          position += 2;
          return value;
        case 206:
          value = dataView.getUint32(position);
          position += 4;
          return value;
        case 207:
          if (currentUnpackr.int64AsType === "number") {
            value = dataView.getUint32(position) * 4294967296;
            value += dataView.getUint32(position + 4);
          } else if (currentUnpackr.int64AsType === "string") {
            value = dataView.getBigUint64(position).toString();
          } else if (currentUnpackr.int64AsType === "auto") {
            value = dataView.getBigUint64(position);
            if (value <= BigInt(2) << BigInt(52)) value = Number(value);
          } else
            value = dataView.getBigUint64(position);
          position += 8;
          return value;
        // int handlers
        case 208:
          return dataView.getInt8(position++);
        case 209:
          value = dataView.getInt16(position);
          position += 2;
          return value;
        case 210:
          value = dataView.getInt32(position);
          position += 4;
          return value;
        case 211:
          if (currentUnpackr.int64AsType === "number") {
            value = dataView.getInt32(position) * 4294967296;
            value += dataView.getUint32(position + 4);
          } else if (currentUnpackr.int64AsType === "string") {
            value = dataView.getBigInt64(position).toString();
          } else if (currentUnpackr.int64AsType === "auto") {
            value = dataView.getBigInt64(position);
            if (value >= BigInt(-2) << BigInt(52) && value <= BigInt(2) << BigInt(52)) value = Number(value);
          } else
            value = dataView.getBigInt64(position);
          position += 8;
          return value;
        case 212:
          value = src[position++];
          if (value == 114) {
            return recordDefinition(src[position++] & 63);
          } else {
            let extension = currentExtensions[value];
            if (extension) {
              if (extension.read) {
                position++;
                return extension.read(read());
              } else if (extension.noBuffer) {
                position++;
                return extension();
              } else
                return extension(src.subarray(position, ++position));
            } else
              throw new Error("Unknown extension " + value);
          }
        case 213:
          value = src[position];
          if (value == 114) {
            position++;
            return recordDefinition(src[position++] & 63, src[position++]);
          } else
            return readExt(2);
        case 214:
          return readExt(4);
        case 215:
          return readExt(8);
        case 216:
          return readExt(16);
        case 217:
          value = src[position++];
          if (srcStringEnd >= position) {
            return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
          }
          return readString8(value);
        case 218:
          value = dataView.getUint16(position);
          position += 2;
          if (srcStringEnd >= position) {
            return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
          }
          return readString16(value);
        case 219:
          value = dataView.getUint32(position);
          position += 4;
          if (srcStringEnd >= position) {
            return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
          }
          return readString32(value);
        case 220:
          value = dataView.getUint16(position);
          position += 2;
          return readArray(value);
        case 221:
          value = dataView.getUint32(position);
          position += 4;
          return readArray(value);
        case 222:
          value = dataView.getUint16(position);
          position += 2;
          return readMap(value);
        case 223:
          value = dataView.getUint32(position);
          position += 4;
          return readMap(value);
        default:
          if (token >= 224)
            return token - 256;
          if (token === void 0) {
            let error = new Error("Unexpected end of MessagePack data");
            error.incomplete = true;
            throw error;
          }
          throw new Error("Unknown MessagePack token " + token);
      }
    }
  }
  var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  function createStructureReader(structure, firstId) {
    function readObject() {
      if (readObject.count++ > inlineObjectReadThreshold) {
        let readObject2 = structure.read = new Function("r", "return function(){return " + (currentUnpackr.freezeData ? "Object.freeze" : "") + "({" + structure.map((key) => key === "__proto__" ? "__proto_:r()" : validName.test(key) ? key + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "})}")(read);
        if (structure.highByte === 0)
          structure.read = createSecondByteReader(firstId, structure.read);
        return readObject2();
      }
      let object = {};
      for (let i2 = 0, l2 = structure.length; i2 < l2; i2++) {
        let key = structure[i2];
        if (key === "__proto__")
          key = "__proto_";
        object[key] = read();
      }
      if (currentUnpackr.freezeData)
        return Object.freeze(object);
      return object;
    }
    readObject.count = 0;
    if (structure.highByte === 0) {
      return createSecondByteReader(firstId, readObject);
    }
    return readObject;
  }
  var createSecondByteReader = (firstId, read0) => {
    return function() {
      let highByte = src[position++];
      if (highByte === 0)
        return read0();
      let id2 = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5);
      let structure = currentStructures[id2] || loadStructures()[id2];
      if (!structure) {
        throw new Error("Record id is not defined for " + id2);
      }
      if (!structure.read)
        structure.read = createStructureReader(structure, firstId);
      return structure.read();
    };
  };
  function loadStructures() {
    let loadedStructures = saveState(() => {
      src = null;
      return currentUnpackr.getStructures();
    });
    return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures);
  }
  var readFixedString = readStringJS;
  var readString8 = readStringJS;
  var readString16 = readStringJS;
  var readString32 = readStringJS;
  function readStringJS(length) {
    let result;
    if (length < 16) {
      if (result = shortStringInJS(length))
        return result;
    }
    if (length > 64 && decoder)
      return decoder.decode(src.subarray(position, position += length));
    const end = position + length;
    const units = [];
    result = "";
    while (position < end) {
      const byte1 = src[position++];
      if ((byte1 & 128) === 0) {
        units.push(byte1);
      } else if ((byte1 & 224) === 192) {
        const byte2 = src[position++] & 63;
        units.push((byte1 & 31) << 6 | byte2);
      } else if ((byte1 & 240) === 224) {
        const byte2 = src[position++] & 63;
        const byte3 = src[position++] & 63;
        units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
      } else if ((byte1 & 248) === 240) {
        const byte2 = src[position++] & 63;
        const byte3 = src[position++] & 63;
        const byte4 = src[position++] & 63;
        let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
        if (unit > 65535) {
          unit -= 65536;
          units.push(unit >>> 10 & 1023 | 55296);
          unit = 56320 | unit & 1023;
        }
        units.push(unit);
      } else {
        units.push(byte1);
      }
      if (units.length >= 4096) {
        result += fromCharCode.apply(String, units);
        units.length = 0;
      }
    }
    if (units.length > 0) {
      result += fromCharCode.apply(String, units);
    }
    return result;
  }
  function readArray(length) {
    let array = new Array(length);
    for (let i2 = 0; i2 < length; i2++) {
      array[i2] = read();
    }
    if (currentUnpackr.freezeData)
      return Object.freeze(array);
    return array;
  }
  function readMap(length) {
    if (currentUnpackr.mapsAsObjects) {
      let object = {};
      for (let i2 = 0; i2 < length; i2++) {
        let key = readKey();
        if (key === "__proto__")
          key = "__proto_";
        object[key] = read();
      }
      return object;
    } else {
      let map = /* @__PURE__ */ new Map();
      for (let i2 = 0; i2 < length; i2++) {
        map.set(read(), read());
      }
      return map;
    }
  }
  var fromCharCode = String.fromCharCode;
  function longStringInJS(length) {
    let start = position;
    let bytes = new Array(length);
    for (let i2 = 0; i2 < length; i2++) {
      const byte = src[position++];
      if ((byte & 128) > 0) {
        position = start;
        return;
      }
      bytes[i2] = byte;
    }
    return fromCharCode.apply(String, bytes);
  }
  function shortStringInJS(length) {
    if (length < 4) {
      if (length < 2) {
        if (length === 0)
          return "";
        else {
          let a2 = src[position++];
          if ((a2 & 128) > 1) {
            position -= 1;
            return;
          }
          return fromCharCode(a2);
        }
      } else {
        let a2 = src[position++];
        let b2 = src[position++];
        if ((a2 & 128) > 0 || (b2 & 128) > 0) {
          position -= 2;
          return;
        }
        if (length < 3)
          return fromCharCode(a2, b2);
        let c2 = src[position++];
        if ((c2 & 128) > 0) {
          position -= 3;
          return;
        }
        return fromCharCode(a2, b2, c2);
      }
    } else {
      let a2 = src[position++];
      let b2 = src[position++];
      let c2 = src[position++];
      let d2 = src[position++];
      if ((a2 & 128) > 0 || (b2 & 128) > 0 || (c2 & 128) > 0 || (d2 & 128) > 0) {
        position -= 4;
        return;
      }
      if (length < 6) {
        if (length === 4)
          return fromCharCode(a2, b2, c2, d2);
        else {
          let e2 = src[position++];
          if ((e2 & 128) > 0) {
            position -= 5;
            return;
          }
          return fromCharCode(a2, b2, c2, d2, e2);
        }
      } else if (length < 8) {
        let e2 = src[position++];
        let f2 = src[position++];
        if ((e2 & 128) > 0 || (f2 & 128) > 0) {
          position -= 6;
          return;
        }
        if (length < 7)
          return fromCharCode(a2, b2, c2, d2, e2, f2);
        let g2 = src[position++];
        if ((g2 & 128) > 0) {
          position -= 7;
          return;
        }
        return fromCharCode(a2, b2, c2, d2, e2, f2, g2);
      } else {
        let e2 = src[position++];
        let f2 = src[position++];
        let g2 = src[position++];
        let h2 = src[position++];
        if ((e2 & 128) > 0 || (f2 & 128) > 0 || (g2 & 128) > 0 || (h2 & 128) > 0) {
          position -= 8;
          return;
        }
        if (length < 10) {
          if (length === 8)
            return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2);
          else {
            let i2 = src[position++];
            if ((i2 & 128) > 0) {
              position -= 9;
              return;
            }
            return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2);
          }
        } else if (length < 12) {
          let i2 = src[position++];
          let j2 = src[position++];
          if ((i2 & 128) > 0 || (j2 & 128) > 0) {
            position -= 10;
            return;
          }
          if (length < 11)
            return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2);
          let k2 = src[position++];
          if ((k2 & 128) > 0) {
            position -= 11;
            return;
          }
          return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2);
        } else {
          let i2 = src[position++];
          let j2 = src[position++];
          let k2 = src[position++];
          let l2 = src[position++];
          if ((i2 & 128) > 0 || (j2 & 128) > 0 || (k2 & 128) > 0 || (l2 & 128) > 0) {
            position -= 12;
            return;
          }
          if (length < 14) {
            if (length === 12)
              return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2);
            else {
              let m2 = src[position++];
              if ((m2 & 128) > 0) {
                position -= 13;
                return;
              }
              return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2);
            }
          } else {
            let m2 = src[position++];
            let n2 = src[position++];
            if ((m2 & 128) > 0 || (n2 & 128) > 0) {
              position -= 14;
              return;
            }
            if (length < 15)
              return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2);
            let o2 = src[position++];
            if ((o2 & 128) > 0) {
              position -= 15;
              return;
            }
            return fromCharCode(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2);
          }
        }
      }
    }
  }
  function readOnlyJSString() {
    let token = src[position++];
    let length;
    if (token < 192) {
      length = token - 160;
    } else {
      switch (token) {
        case 217:
          length = src[position++];
          break;
        case 218:
          length = dataView.getUint16(position);
          position += 2;
          break;
        case 219:
          length = dataView.getUint32(position);
          position += 4;
          break;
        default:
          throw new Error("Expected string");
      }
    }
    return readStringJS(length);
  }
  function readBin(length) {
    return currentUnpackr.copyBuffers ? (
      // specifically use the copying slice (not the node one)
      Uint8Array.prototype.slice.call(src, position, position += length)
    ) : src.subarray(position, position += length);
  }
  function readExt(length) {
    let type = src[position++];
    if (currentExtensions[type]) {
      let end;
      return currentExtensions[type](src.subarray(position, end = position += length), (readPosition) => {
        position = readPosition;
        try {
          return read();
        } finally {
          position = end;
        }
      });
    } else
      throw new Error("Unknown extension type " + type);
  }
  var keyCache = new Array(4096);
  function readKey() {
    let length = src[position++];
    if (length >= 160 && length < 192) {
      length = length - 160;
      if (srcStringEnd >= position)
        return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
      else if (!(srcStringEnd == 0 && srcEnd < 180))
        return readFixedString(length);
    } else {
      position--;
      return asSafeString(read());
    }
    let key = (length << 5 ^ (length > 1 ? dataView.getUint16(position) : length > 0 ? src[position] : 0)) & 4095;
    let entry = keyCache[key];
    let checkPosition = position;
    let end = position + length - 3;
    let chunk;
    let i2 = 0;
    if (entry && entry.bytes == length) {
      while (checkPosition < end) {
        chunk = dataView.getUint32(checkPosition);
        if (chunk != entry[i2++]) {
          checkPosition = 1879048192;
          break;
        }
        checkPosition += 4;
      }
      end += 3;
      while (checkPosition < end) {
        chunk = src[checkPosition++];
        if (chunk != entry[i2++]) {
          checkPosition = 1879048192;
          break;
        }
      }
      if (checkPosition === end) {
        position = checkPosition;
        return entry.string;
      }
      end -= 3;
      checkPosition = position;
    }
    entry = [];
    keyCache[key] = entry;
    entry.bytes = length;
    while (checkPosition < end) {
      chunk = dataView.getUint32(checkPosition);
      entry.push(chunk);
      checkPosition += 4;
    }
    end += 3;
    while (checkPosition < end) {
      chunk = src[checkPosition++];
      entry.push(chunk);
    }
    let string2 = length < 16 ? shortStringInJS(length) : longStringInJS(length);
    if (string2 != null)
      return entry.string = string2;
    return entry.string = readFixedString(length);
  }
  function asSafeString(property) {
    if (typeof property === "string") return property;
    if (typeof property === "number" || typeof property === "boolean" || typeof property === "bigint") return property.toString();
    if (property == null) return property + "";
    if (currentUnpackr.allowArraysInMapKeys && Array.isArray(property) && property.flat().every((item) => ["string", "number", "boolean", "bigint"].includes(typeof item))) {
      return property.flat().toString();
    }
    throw new Error(`Invalid property type for record: ${typeof property}`);
  }
  var recordDefinition = (id2, highByte) => {
    let structure = read().map(asSafeString);
    let firstByte = id2;
    if (highByte !== void 0) {
      id2 = id2 < 32 ? -((highByte << 5) + id2) : (highByte << 5) + id2;
      structure.highByte = highByte;
    }
    let existingStructure = currentStructures[id2];
    if (existingStructure && (existingStructure.isShared || sequentialMode)) {
      (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id2] = existingStructure;
    }
    currentStructures[id2] = structure;
    structure.read = createStructureReader(structure, firstByte);
    return structure.read();
  };
  currentExtensions[0] = () => {
  };
  currentExtensions[0].noBuffer = true;
  currentExtensions[66] = (data) => {
    let length = data.length;
    let value = BigInt(data[0] & 128 ? data[0] - 256 : data[0]);
    for (let i2 = 1; i2 < length; i2++) {
      value <<= BigInt(8);
      value += BigInt(data[i2]);
    }
    return value;
  };
  var errors = { Error, TypeError, ReferenceError };
  currentExtensions[101] = () => {
    let data = read();
    return (errors[data[0]] || Error)(data[1], { cause: data[2] });
  };
  currentExtensions[105] = (data) => {
    if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
    let id2 = dataView.getUint32(position - 4);
    if (!referenceMap)
      referenceMap = /* @__PURE__ */ new Map();
    let token = src[position];
    let target2;
    if (token >= 144 && token < 160 || token == 220 || token == 221)
      target2 = [];
    else
      target2 = {};
    let refEntry = { target: target2 };
    referenceMap.set(id2, refEntry);
    let targetProperties = read();
    if (refEntry.used)
      return Object.assign(target2, targetProperties);
    refEntry.target = targetProperties;
    return targetProperties;
  };
  currentExtensions[112] = (data) => {
    if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
    let id2 = dataView.getUint32(position - 4);
    let refEntry = referenceMap.get(id2);
    refEntry.used = true;
    return refEntry.target;
  };
  currentExtensions[115] = () => new Set(read());
  var typedArrays = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((type) => type + "Array");
  var glbl = typeof globalThis === "object" ? globalThis : window;
  currentExtensions[116] = (data) => {
    let typeCode = data[0];
    let typedArrayName = typedArrays[typeCode];
    if (!typedArrayName) {
      if (typeCode === 16) {
        let ab = new ArrayBuffer(data.length - 1);
        let u8 = new Uint8Array(ab);
        u8.set(data.subarray(1));
        return ab;
      }
      throw new Error("Could not find typed array for code " + typeCode);
    }
    return new glbl[typedArrayName](Uint8Array.prototype.slice.call(data, 1).buffer);
  };
  currentExtensions[120] = () => {
    let data = read();
    return new RegExp(data[0], data[1]);
  };
  var TEMP_BUNDLE = [];
  currentExtensions[98] = (data) => {
    let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
    let dataPosition = position;
    position += dataSize - data.length;
    bundledStrings = TEMP_BUNDLE;
    bundledStrings = [readOnlyJSString(), readOnlyJSString()];
    bundledStrings.position0 = 0;
    bundledStrings.position1 = 0;
    bundledStrings.postBundlePosition = position;
    position = dataPosition;
    return read();
  };
  currentExtensions[255] = (data) => {
    if (data.length == 4)
      return new Date((data[0] * 16777216 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1e3);
    else if (data.length == 8)
      return new Date(
        ((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1e6 + ((data[3] & 3) * 4294967296 + data[4] * 16777216 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1e3
      );
    else if (data.length == 12)
      return new Date(
        ((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1e6 + ((data[4] & 128 ? -281474976710656 : 0) + data[6] * 1099511627776 + data[7] * 4294967296 + data[8] * 16777216 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1e3
      );
    else
      return /* @__PURE__ */ new Date("invalid");
  };
  function saveState(callback) {
    if (onSaveState)
      onSaveState();
    let savedSrcEnd = srcEnd;
    let savedPosition = position;
    let savedStringPosition = stringPosition;
    let savedSrcStringStart = srcStringStart;
    let savedSrcStringEnd = srcStringEnd;
    let savedSrcString = srcString;
    let savedStrings = strings;
    let savedReferenceMap = referenceMap;
    let savedBundledStrings = bundledStrings;
    let savedSrc = new Uint8Array(src.slice(0, srcEnd));
    let savedStructures = currentStructures;
    let savedStructuresContents = currentStructures.slice(0, currentStructures.length);
    let savedPackr = currentUnpackr;
    let savedSequentialMode = sequentialMode;
    let value = callback();
    srcEnd = savedSrcEnd;
    position = savedPosition;
    stringPosition = savedStringPosition;
    srcStringStart = savedSrcStringStart;
    srcStringEnd = savedSrcStringEnd;
    srcString = savedSrcString;
    strings = savedStrings;
    referenceMap = savedReferenceMap;
    bundledStrings = savedBundledStrings;
    src = savedSrc;
    sequentialMode = savedSequentialMode;
    currentStructures = savedStructures;
    currentStructures.splice(0, currentStructures.length, ...savedStructuresContents);
    currentUnpackr = savedPackr;
    dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return value;
  }
  function clearSource() {
    src = null;
    referenceMap = null;
    currentStructures = null;
  }
  var mult10 = new Array(147);
  for (let i2 = 0; i2 < 256; i2++) {
    mult10[i2] = +("1e" + Math.floor(45.15 - i2 * 0.30103));
  }
  var defaultUnpackr = new Unpackr({ useRecords: false });
  var unpack = defaultUnpackr.unpack;
  var unpackMultiple = defaultUnpackr.unpackMultiple;
  var decode2 = defaultUnpackr.unpack;
  var FLOAT32_OPTIONS = {
    NEVER: 0,
    ALWAYS: 1,
    DECIMAL_ROUND: 3,
    DECIMAL_FIT: 4
  };
  var f32Array = new Float32Array(1);
  var u8Array = new Uint8Array(f32Array.buffer, 0, 4);

  // ../../node_modules/.pnpm/@colyseus+msgpackr@1.11.3/node_modules/@colyseus/msgpackr/pack.js
  var textEncoder2;
  try {
    textEncoder2 = new TextEncoder();
  } catch (error) {
  }
  var extensions;
  var extensionClasses;
  var hasNodeBuffer = typeof Buffer !== "undefined";
  var ByteArrayAllocate = hasNodeBuffer ? function(length) {
    return Buffer.allocUnsafeSlow(length);
  } : Uint8Array;
  var ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
  var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
  var target;
  var keysTarget;
  var targetView;
  var position2 = 0;
  var safeEnd;
  var bundledStrings2 = null;
  var writeStructSlots;
  var MAX_BUNDLE_SIZE = 21760;
  var hasNonLatin = /[\u0080-\uFFFF]/;
  var RECORD_SYMBOL = /* @__PURE__ */ Symbol("record-id");
  var Packr = class extends Unpackr {
    constructor(options) {
      super(options);
      this.offset = 0;
      let typeBuffer;
      let start;
      let hasSharedUpdate;
      let structures;
      let referenceMap2;
      let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string2, position3) {
        return target.utf8Write(string2, position3, target.byteLength - position3);
      } : textEncoder2 && textEncoder2.encodeInto ? function(string2, position3) {
        return textEncoder2.encodeInto(string2, target.subarray(position3)).written;
      } : false;
      let packr = this;
      if (!options)
        options = {};
      let isSequential = options && options.sequential;
      let hasSharedStructures = options.structures || options.saveStructures;
      let maxSharedStructures = options.maxSharedStructures;
      if (maxSharedStructures == null)
        maxSharedStructures = hasSharedStructures ? 32 : 0;
      if (maxSharedStructures > 8160)
        throw new Error("Maximum maxSharedStructure is 8160");
      if (options.structuredClone && options.moreTypes == void 0) {
        this.moreTypes = true;
      }
      let maxOwnStructures = options.maxOwnStructures;
      if (maxOwnStructures == null)
        maxOwnStructures = hasSharedStructures ? 32 : 64;
      if (!this.structures && options.useRecords != false)
        this.structures = [];
      let useTwoByteRecords = maxSharedStructures > 32 || maxOwnStructures + maxSharedStructures > 64;
      let sharedLimitId = maxSharedStructures + 64;
      let maxStructureId = maxSharedStructures + maxOwnStructures + 64;
      if (maxStructureId > 8256) {
        throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
      }
      let recordIdsToRemove = [];
      let transitionsCount = 0;
      let serializationsSinceTransitionRebuild = 0;
      this.pack = this.encode = function(value, encodeOptions) {
        if (!target) {
          target = new ByteArrayAllocate(8192);
          targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, 8192));
          position2 = 0;
        }
        safeEnd = target.length - 10;
        if (safeEnd - position2 < 2048) {
          target = new ByteArrayAllocate(target.length);
          targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length));
          safeEnd = target.length - 10;
          position2 = 0;
        } else
          position2 = position2 + 7 & 2147483640;
        start = position2;
        if (encodeOptions & RESERVE_START_SPACE) position2 += encodeOptions & 255;
        referenceMap2 = packr.structuredClone ? /* @__PURE__ */ new Map() : null;
        if (packr.bundleStrings && typeof value !== "string") {
          bundledStrings2 = [];
          bundledStrings2.size = Infinity;
        } else
          bundledStrings2 = null;
        structures = packr.structures;
        if (structures) {
          if (structures.uninitialized)
            structures = packr._mergeStructures(packr.getStructures());
          let sharedLength = structures.sharedLength || 0;
          if (sharedLength > maxSharedStructures) {
            throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + structures.sharedLength);
          }
          if (!structures.transitions) {
            structures.transitions = /* @__PURE__ */ Object.create(null);
            for (let i2 = 0; i2 < sharedLength; i2++) {
              let keys = structures[i2];
              if (!keys)
                continue;
              let nextTransition, transition = structures.transitions;
              for (let j2 = 0, l2 = keys.length; j2 < l2; j2++) {
                let key = keys[j2];
                nextTransition = transition[key];
                if (!nextTransition) {
                  nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                }
                transition = nextTransition;
              }
              transition[RECORD_SYMBOL] = i2 + 64;
            }
            this.lastNamedStructuresLength = sharedLength;
          }
          if (!isSequential) {
            structures.nextId = sharedLength + 64;
          }
        }
        if (hasSharedUpdate)
          hasSharedUpdate = false;
        let encodingError;
        try {
          if (packr.randomAccessStructure && value && value.constructor && value.constructor === Object)
            writeStruct(value);
          else
            pack2(value);
          let lastBundle = bundledStrings2;
          if (bundledStrings2)
            writeBundles(start, pack2, 0);
          if (referenceMap2 && referenceMap2.idsToInsert) {
            let idsToInsert = referenceMap2.idsToInsert.sort((a2, b2) => a2.offset > b2.offset ? 1 : -1);
            let i2 = idsToInsert.length;
            let incrementPosition = -1;
            while (lastBundle && i2 > 0) {
              let insertionPoint = idsToInsert[--i2].offset + start;
              if (insertionPoint < lastBundle.stringsPosition + start && incrementPosition === -1)
                incrementPosition = 0;
              if (insertionPoint > lastBundle.position + start) {
                if (incrementPosition >= 0)
                  incrementPosition += 6;
              } else {
                if (incrementPosition >= 0) {
                  targetView.setUint32(
                    lastBundle.position + start,
                    targetView.getUint32(lastBundle.position + start) + incrementPosition
                  );
                  incrementPosition = -1;
                }
                lastBundle = lastBundle.previous;
                i2++;
              }
            }
            if (incrementPosition >= 0 && lastBundle) {
              targetView.setUint32(
                lastBundle.position + start,
                targetView.getUint32(lastBundle.position + start) + incrementPosition
              );
            }
            position2 += idsToInsert.length * 6;
            if (position2 > safeEnd)
              makeRoom(position2);
            packr.offset = position2;
            let serialized = insertIds(target.subarray(start, position2), idsToInsert);
            referenceMap2 = null;
            return serialized;
          }
          packr.offset = position2;
          if (encodeOptions & REUSE_BUFFER_MODE) {
            target.start = start;
            target.end = position2;
            return target;
          }
          return target.subarray(start, position2);
        } catch (error) {
          encodingError = error;
          throw error;
        } finally {
          if (structures) {
            resetStructures();
            if (hasSharedUpdate && packr.saveStructures) {
              let sharedLength = structures.sharedLength || 0;
              let returnBuffer = target.subarray(start, position2);
              let newSharedData = prepareStructures(structures, packr);
              if (!encodingError) {
                if (packr.saveStructures(newSharedData, newSharedData.isCompatible) === false) {
                  return packr.pack(value, encodeOptions);
                }
                packr.lastNamedStructuresLength = sharedLength;
                if (target.length > 1073741824) target = null;
                return returnBuffer;
              }
            }
          }
          if (target.length > 1073741824) target = null;
          if (encodeOptions & RESET_BUFFER_MODE)
            position2 = start;
        }
      };
      const resetStructures = () => {
        if (serializationsSinceTransitionRebuild < 10)
          serializationsSinceTransitionRebuild++;
        let sharedLength = structures.sharedLength || 0;
        if (structures.length > sharedLength && !isSequential)
          structures.length = sharedLength;
        if (transitionsCount > 1e4) {
          structures.transitions = null;
          serializationsSinceTransitionRebuild = 0;
          transitionsCount = 0;
          if (recordIdsToRemove.length > 0)
            recordIdsToRemove = [];
        } else if (recordIdsToRemove.length > 0 && !isSequential) {
          for (let i2 = 0, l2 = recordIdsToRemove.length; i2 < l2; i2++) {
            recordIdsToRemove[i2][RECORD_SYMBOL] = 0;
          }
          recordIdsToRemove = [];
        }
      };
      const packArray = (value) => {
        var length = value.length;
        if (length < 16) {
          target[position2++] = 144 | length;
        } else if (length < 65536) {
          target[position2++] = 220;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          target[position2++] = 221;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        for (let i2 = 0; i2 < length; i2++) {
          pack2(value[i2]);
        }
      };
      const pack2 = (value) => {
        if (position2 > safeEnd)
          target = makeRoom(position2);
        var type = typeof value;
        var length;
        if (type === "string") {
          let strLength = value.length;
          if (bundledStrings2 && strLength >= 4 && strLength < 4096) {
            if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
              let extStart;
              let maxBytes2 = (bundledStrings2[0] ? bundledStrings2[0].length * 3 + bundledStrings2[1].length : 0) + 10;
              if (position2 + maxBytes2 > safeEnd)
                target = makeRoom(position2 + maxBytes2);
              let lastBundle;
              if (bundledStrings2.position) {
                lastBundle = bundledStrings2;
                target[position2] = 200;
                position2 += 3;
                target[position2++] = 98;
                extStart = position2 - start;
                position2 += 4;
                writeBundles(start, pack2, 0);
                targetView.setUint16(extStart + start - 3, position2 - start - extStart);
              } else {
                target[position2++] = 214;
                target[position2++] = 98;
                extStart = position2 - start;
                position2 += 4;
              }
              bundledStrings2 = ["", ""];
              bundledStrings2.previous = lastBundle;
              bundledStrings2.size = 0;
              bundledStrings2.position = extStart;
            }
            let twoByte = hasNonLatin.test(value);
            bundledStrings2[twoByte ? 0 : 1] += value;
            target[position2++] = 193;
            pack2(twoByte ? -strLength : strLength);
            return;
          }
          let headerSize;
          if (strLength < 32) {
            headerSize = 1;
          } else if (strLength < 256) {
            headerSize = 2;
          } else if (strLength < 65536) {
            headerSize = 3;
          } else {
            headerSize = 5;
          }
          let maxBytes = strLength * 3;
          if (position2 + maxBytes > safeEnd)
            target = makeRoom(position2 + maxBytes);
          if (strLength < 64 || !encodeUtf8) {
            let i2, c1, c2, strPosition = position2 + headerSize;
            for (i2 = 0; i2 < strLength; i2++) {
              c1 = value.charCodeAt(i2);
              if (c1 < 128) {
                target[strPosition++] = c1;
              } else if (c1 < 2048) {
                target[strPosition++] = c1 >> 6 | 192;
                target[strPosition++] = c1 & 63 | 128;
              } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i2 + 1)) & 64512) === 56320) {
                c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
                i2++;
                target[strPosition++] = c1 >> 18 | 240;
                target[strPosition++] = c1 >> 12 & 63 | 128;
                target[strPosition++] = c1 >> 6 & 63 | 128;
                target[strPosition++] = c1 & 63 | 128;
              } else {
                target[strPosition++] = c1 >> 12 | 224;
                target[strPosition++] = c1 >> 6 & 63 | 128;
                target[strPosition++] = c1 & 63 | 128;
              }
            }
            length = strPosition - position2 - headerSize;
          } else {
            length = encodeUtf8(value, position2 + headerSize);
          }
          if (length < 32) {
            target[position2++] = 160 | length;
          } else if (length < 256) {
            if (headerSize < 2) {
              target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
            }
            target[position2++] = 217;
            target[position2++] = length;
          } else if (length < 65536) {
            if (headerSize < 3) {
              target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
            }
            target[position2++] = 218;
            target[position2++] = length >> 8;
            target[position2++] = length & 255;
          } else {
            if (headerSize < 5) {
              target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
            }
            target[position2++] = 219;
            targetView.setUint32(position2, length);
            position2 += 4;
          }
          position2 += length;
        } else if (type === "number") {
          if (value >>> 0 === value) {
            if (value < 32 || value < 128 && this.useRecords === false || value < 64 && !this.randomAccessStructure) {
              target[position2++] = value;
            } else if (value < 256) {
              target[position2++] = 204;
              target[position2++] = value;
            } else if (value < 65536) {
              target[position2++] = 205;
              target[position2++] = value >> 8;
              target[position2++] = value & 255;
            } else {
              target[position2++] = 206;
              targetView.setUint32(position2, value);
              position2 += 4;
            }
          } else if (value >> 0 === value) {
            if (value >= -32) {
              target[position2++] = 256 + value;
            } else if (value >= -128) {
              target[position2++] = 208;
              target[position2++] = value + 256;
            } else if (value >= -32768) {
              target[position2++] = 209;
              targetView.setInt16(position2, value);
              position2 += 2;
            } else {
              target[position2++] = 210;
              targetView.setInt32(position2, value);
              position2 += 4;
            }
          } else {
            let useFloat32;
            if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
              target[position2++] = 202;
              targetView.setFloat32(position2, value);
              let xShifted;
              if (useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
              (xShifted = value * mult10[(target[position2] & 127) << 1 | target[position2 + 1] >> 7]) >> 0 === xShifted) {
                position2 += 4;
                return;
              } else
                position2--;
            }
            target[position2++] = 203;
            targetView.setFloat64(position2, value);
            position2 += 8;
          }
        } else if (type === "object" || type === "function") {
          if (!value)
            target[position2++] = 192;
          else {
            if (referenceMap2) {
              let referee = referenceMap2.get(value);
              if (referee) {
                if (!referee.id) {
                  let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                  referee.id = idsToInsert.push(referee);
                }
                target[position2++] = 214;
                target[position2++] = 112;
                targetView.setUint32(position2, referee.id);
                position2 += 4;
                return;
              } else
                referenceMap2.set(value, { offset: position2 - start });
            }
            let constructor = value.constructor;
            if (constructor === Object) {
              writeObject(value);
            } else if (constructor === Array) {
              packArray(value);
            } else if (constructor === Map) {
              if (this.mapAsEmptyObject) target[position2++] = 128;
              else {
                length = value.size;
                if (length < 16) {
                  target[position2++] = 128 | length;
                } else if (length < 65536) {
                  target[position2++] = 222;
                  target[position2++] = length >> 8;
                  target[position2++] = length & 255;
                } else {
                  target[position2++] = 223;
                  targetView.setUint32(position2, length);
                  position2 += 4;
                }
                for (let [key, entryValue] of value) {
                  pack2(key);
                  pack2(entryValue);
                }
              }
            } else {
              for (let i2 = 0, l2 = extensions.length; i2 < l2; i2++) {
                let extensionClass = extensionClasses[i2];
                if (value instanceof extensionClass) {
                  let extension = extensions[i2];
                  if (extension.write) {
                    if (extension.type) {
                      target[position2++] = 212;
                      target[position2++] = extension.type;
                      target[position2++] = 0;
                    }
                    let writeResult = extension.write.call(this, value);
                    if (writeResult === value) {
                      if (Array.isArray(value)) {
                        packArray(value);
                      } else {
                        writeObject(value);
                      }
                    } else {
                      pack2(writeResult);
                    }
                    return;
                  }
                  let currentTarget = target;
                  let currentTargetView = targetView;
                  let currentPosition = position2;
                  target = null;
                  let result;
                  try {
                    result = extension.pack.call(this, value, (size) => {
                      target = currentTarget;
                      currentTarget = null;
                      position2 += size;
                      if (position2 > safeEnd)
                        makeRoom(position2);
                      return {
                        target,
                        targetView,
                        position: position2 - size
                      };
                    }, pack2);
                  } finally {
                    if (currentTarget) {
                      target = currentTarget;
                      targetView = currentTargetView;
                      position2 = currentPosition;
                      safeEnd = target.length - 10;
                    }
                  }
                  if (result) {
                    if (result.length + position2 > safeEnd)
                      makeRoom(result.length + position2);
                    position2 = writeExtensionData(result, target, position2, extension.type);
                  }
                  return;
                }
              }
              if (Array.isArray(value)) {
                packArray(value);
              } else {
                if (value.toJSON) {
                  const json = value.toJSON();
                  if (json !== value)
                    return pack2(json);
                }
                if (type === "function")
                  return pack2(this.writeFunction && this.writeFunction(value));
                writeObject(value);
              }
            }
          }
        } else if (type === "boolean") {
          target[position2++] = value ? 195 : 194;
        } else if (type === "bigint") {
          if (value < BigInt(1) << BigInt(63) && value >= -(BigInt(1) << BigInt(63))) {
            target[position2++] = 211;
            targetView.setBigInt64(position2, value);
          } else if (value < BigInt(1) << BigInt(64) && value > 0) {
            target[position2++] = 207;
            targetView.setBigUint64(position2, value);
          } else {
            if (this.largeBigIntToFloat) {
              target[position2++] = 203;
              targetView.setFloat64(position2, Number(value));
            } else if (this.largeBigIntToString) {
              return pack2(value.toString());
            } else if (this.useBigIntExtension && value < BigInt(2) ** BigInt(1023) && value > -(BigInt(2) ** BigInt(1023))) {
              target[position2++] = 199;
              position2++;
              target[position2++] = 66;
              let bytes = [];
              let alignedSign;
              do {
                let byte = value & BigInt(255);
                alignedSign = (byte & BigInt(128)) === (value < BigInt(0) ? BigInt(128) : BigInt(0));
                bytes.push(byte);
                value >>= BigInt(8);
              } while (!((value === BigInt(0) || value === BigInt(-1)) && alignedSign));
              target[position2 - 2] = bytes.length;
              for (let i2 = bytes.length; i2 > 0; ) {
                target[position2++] = Number(bytes[--i2]);
              }
              return;
            } else {
              throw new RangeError(value + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
            }
          }
          position2 += 8;
        } else if (type === "undefined") {
          if (this.encodeUndefinedAsNil)
            target[position2++] = 192;
          else {
            target[position2++] = 212;
            target[position2++] = 0;
            target[position2++] = 0;
          }
        } else {
          throw new Error("Unknown type: " + type);
        }
      };
      const writePlainObject = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (object) => {
        let keys;
        if (this.skipValues) {
          keys = [];
          for (let key2 in object) {
            if ((typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key2)) && !this.skipValues.includes(object[key2]))
              keys.push(key2);
          }
        } else {
          keys = Object.keys(object);
        }
        let length = keys.length;
        if (length < 16) {
          target[position2++] = 128 | length;
        } else if (length < 65536) {
          target[position2++] = 222;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          target[position2++] = 223;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        let key;
        if (this.coercibleKeyAsNumber) {
          for (let i2 = 0; i2 < length; i2++) {
            key = keys[i2];
            let num = Number(key);
            pack2(isNaN(num) ? key : num);
            pack2(object[key]);
          }
        } else {
          for (let i2 = 0; i2 < length; i2++) {
            pack2(key = keys[i2]);
            pack2(object[key]);
          }
        }
      } : (object) => {
        target[position2++] = 222;
        let objectOffset = position2 - start;
        position2 += 2;
        let size = 0;
        for (let key in object) {
          if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
            pack2(key);
            pack2(object[key]);
            size++;
          }
        }
        if (size > 65535) {
          throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
        }
        target[objectOffset++ + start] = size >> 8;
        target[objectOffset + start] = size & 255;
      };
      const writeRecord = this.useRecords === false ? writePlainObject : options.progressiveRecords && !useTwoByteRecords ? (
        // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
        (object) => {
          let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
          let objectOffset = position2++ - start;
          let wroteKeys;
          for (let key in object) {
            if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
              nextTransition = transition[key];
              if (nextTransition)
                transition = nextTransition;
              else {
                let keys = Object.keys(object);
                let lastTransition = transition;
                transition = structures.transitions;
                let newTransitions = 0;
                for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
                  let key2 = keys[i2];
                  nextTransition = transition[key2];
                  if (!nextTransition) {
                    nextTransition = transition[key2] = /* @__PURE__ */ Object.create(null);
                    newTransitions++;
                  }
                  transition = nextTransition;
                }
                if (objectOffset + start + 1 == position2) {
                  position2--;
                  newRecord(transition, keys, newTransitions);
                } else
                  insertNewRecord(transition, keys, objectOffset, newTransitions);
                wroteKeys = true;
                transition = lastTransition[key];
              }
              pack2(object[key]);
            }
          }
          if (!wroteKeys) {
            let recordId = transition[RECORD_SYMBOL];
            if (recordId)
              target[objectOffset + start] = recordId;
            else
              insertNewRecord(transition, Object.keys(object), objectOffset, 0);
          }
        }
      ) : (object) => {
        let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
        let newTransitions = 0;
        for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          nextTransition = transition[key];
          if (!nextTransition) {
            nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
            newTransitions++;
          }
          transition = nextTransition;
        }
        let recordId = transition[RECORD_SYMBOL];
        if (recordId) {
          if (recordId >= 96 && useTwoByteRecords) {
            target[position2++] = ((recordId -= 96) & 31) + 96;
            target[position2++] = recordId >> 5;
          } else
            target[position2++] = recordId;
        } else {
          newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions);
        }
        for (let key in object)
          if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
            pack2(object[key]);
          }
      };
      const checkUseRecords = typeof this.useRecords == "function" && this.useRecords;
      const writeObject = checkUseRecords ? (object) => {
        checkUseRecords(object) ? writeRecord(object) : writePlainObject(object);
      } : writeRecord;
      const makeRoom = (end) => {
        let newSize;
        if (end > 16777216) {
          if (end - start > MAX_BUFFER_SIZE)
            throw new Error("Packed buffer would be larger than maximum buffer size");
          newSize = Math.min(
            MAX_BUFFER_SIZE,
            Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
          );
        } else
          newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
        let newBuffer = new ByteArrayAllocate(newSize);
        targetView = newBuffer.dataView || (newBuffer.dataView = new DataView(newBuffer.buffer, 0, newSize));
        end = Math.min(end, target.length);
        if (target.copy)
          target.copy(newBuffer, 0, start, end);
        else
          newBuffer.set(target.slice(start, end));
        position2 -= start;
        start = 0;
        safeEnd = newBuffer.length - 10;
        return target = newBuffer;
      };
      const newRecord = (transition, keys, newTransitions) => {
        let recordId = structures.nextId;
        if (!recordId)
          recordId = 64;
        if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys)) {
          recordId = structures.nextOwnId;
          if (!(recordId < maxStructureId))
            recordId = sharedLimitId;
          structures.nextOwnId = recordId + 1;
        } else {
          if (recordId >= maxStructureId)
            recordId = sharedLimitId;
          structures.nextId = recordId + 1;
        }
        let highByte = keys.highByte = recordId >= 96 && useTwoByteRecords ? recordId - 96 >> 5 : -1;
        transition[RECORD_SYMBOL] = recordId;
        transition.__keys__ = keys;
        structures[recordId - 64] = keys;
        if (recordId < sharedLimitId) {
          keys.isShared = true;
          structures.sharedLength = recordId - 63;
          hasSharedUpdate = true;
          if (highByte >= 0) {
            target[position2++] = (recordId & 31) + 96;
            target[position2++] = highByte;
          } else {
            target[position2++] = recordId;
          }
        } else {
          if (highByte >= 0) {
            target[position2++] = 213;
            target[position2++] = 114;
            target[position2++] = (recordId & 31) + 96;
            target[position2++] = highByte;
          } else {
            target[position2++] = 212;
            target[position2++] = 114;
            target[position2++] = recordId;
          }
          if (newTransitions)
            transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
          if (recordIdsToRemove.length >= maxOwnStructures)
            recordIdsToRemove.shift()[RECORD_SYMBOL] = 0;
          recordIdsToRemove.push(transition);
          pack2(keys);
        }
      };
      const insertNewRecord = (transition, keys, insertionOffset, newTransitions) => {
        let mainTarget = target;
        let mainPosition = position2;
        let mainSafeEnd = safeEnd;
        let mainStart = start;
        target = keysTarget;
        position2 = 0;
        start = 0;
        if (!target)
          keysTarget = target = new ByteArrayAllocate(8192);
        safeEnd = target.length - 10;
        newRecord(transition, keys, newTransitions);
        keysTarget = target;
        let keysPosition = position2;
        target = mainTarget;
        position2 = mainPosition;
        safeEnd = mainSafeEnd;
        start = mainStart;
        if (keysPosition > 1) {
          let newEnd = position2 + keysPosition - 1;
          if (newEnd > safeEnd)
            makeRoom(newEnd);
          let insertionPosition = insertionOffset + start;
          target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position2);
          target.set(keysTarget.slice(0, keysPosition), insertionPosition);
          position2 = newEnd;
        } else {
          target[insertionOffset + start] = keysTarget[0];
        }
      };
      const writeStruct = (object) => {
        let newPosition = writeStructSlots(object, target, start, position2, structures, makeRoom, (value, newPosition2, notifySharedUpdate) => {
          if (notifySharedUpdate)
            return hasSharedUpdate = true;
          position2 = newPosition2;
          let startTarget = target;
          pack2(value);
          resetStructures();
          if (startTarget !== target) {
            return { position: position2, targetView, target };
          }
          return position2;
        }, this);
        if (newPosition === 0)
          return writeObject(object);
        position2 = newPosition;
      };
    }
    useBuffer(buffer) {
      target = buffer;
      target.dataView || (target.dataView = new DataView(target.buffer, target.byteOffset, target.byteLength));
      targetView = target.dataView;
      position2 = 0;
    }
    set position(value) {
      position2 = value;
    }
    get position() {
      return position2;
    }
    set buffer(buffer) {
      target = buffer;
    }
    get buffer() {
      return target;
    }
    clearSharedData() {
      if (this.structures)
        this.structures = [];
      if (this.typedStructs)
        this.typedStructs = [];
    }
  };
  extensionClasses = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, C1Type];
  extensions = [{
    pack(date, allocateForWrite, pack2) {
      let seconds = date.getTime() / 1e3;
      if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 4294967296) {
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(6);
        target2[position3++] = 214;
        target2[position3++] = 255;
        targetView2.setUint32(position3, seconds);
      } else if (seconds > 0 && seconds < 4294967296) {
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(10);
        target2[position3++] = 215;
        target2[position3++] = 255;
        targetView2.setUint32(position3, date.getMilliseconds() * 4e6 + (seconds / 1e3 / 4294967296 >> 0));
        targetView2.setUint32(position3 + 4, seconds);
      } else if (isNaN(seconds)) {
        if (this.onInvalidDate) {
          allocateForWrite(0);
          return pack2(this.onInvalidDate());
        }
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(3);
        target2[position3++] = 212;
        target2[position3++] = 255;
        target2[position3++] = 255;
      } else {
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(15);
        target2[position3++] = 199;
        target2[position3++] = 12;
        target2[position3++] = 255;
        targetView2.setUint32(position3, date.getMilliseconds() * 1e6);
        targetView2.setBigInt64(position3 + 4, BigInt(Math.floor(seconds)));
      }
    }
  }, {
    pack(set, allocateForWrite, pack2) {
      if (this.setAsEmptyObject) {
        allocateForWrite(0);
        return pack2({});
      }
      let array = Array.from(set);
      let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
      if (this.moreTypes) {
        target2[position3++] = 212;
        target2[position3++] = 115;
        target2[position3++] = 0;
      }
      pack2(array);
    }
  }, {
    pack(error, allocateForWrite, pack2) {
      let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
      if (this.moreTypes) {
        target2[position3++] = 212;
        target2[position3++] = 101;
        target2[position3++] = 0;
      }
      pack2([error.name, error.message, error.cause]);
    }
  }, {
    pack(regex, allocateForWrite, pack2) {
      let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
      if (this.moreTypes) {
        target2[position3++] = 212;
        target2[position3++] = 120;
        target2[position3++] = 0;
      }
      pack2([regex.source, regex.flags]);
    }
  }, {
    pack(arrayBuffer, allocateForWrite) {
      if (this.moreTypes)
        writeExtBuffer(arrayBuffer, 16, allocateForWrite);
      else
        writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
    }
  }, {
    pack(typedArray, allocateForWrite) {
      let constructor = typedArray.constructor;
      if (constructor !== ByteArray && this.moreTypes)
        writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
      else
        writeBuffer(typedArray, allocateForWrite);
    }
  }, {
    pack(c1, allocateForWrite) {
      let { target: target2, position: position3 } = allocateForWrite(1);
      target2[position3] = 193;
    }
  }];
  function writeExtBuffer(typedArray, type, allocateForWrite, encode3) {
    let length = typedArray.byteLength;
    if (length + 1 < 256) {
      var { target: target2, position: position3 } = allocateForWrite(4 + length);
      target2[position3++] = 199;
      target2[position3++] = length + 1;
    } else if (length + 1 < 65536) {
      var { target: target2, position: position3 } = allocateForWrite(5 + length);
      target2[position3++] = 200;
      target2[position3++] = length + 1 >> 8;
      target2[position3++] = length + 1 & 255;
    } else {
      var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(7 + length);
      target2[position3++] = 201;
      targetView2.setUint32(position3, length + 1);
      position3 += 4;
    }
    target2[position3++] = 116;
    target2[position3++] = type;
    if (!typedArray.buffer) typedArray = new Uint8Array(typedArray);
    target2.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position3);
  }
  function writeBuffer(buffer, allocateForWrite) {
    let length = buffer.byteLength;
    var target2, position3;
    if (length < 256) {
      var { target: target2, position: position3 } = allocateForWrite(length + 2);
      target2[position3++] = 196;
      target2[position3++] = length;
    } else if (length < 65536) {
      var { target: target2, position: position3 } = allocateForWrite(length + 3);
      target2[position3++] = 197;
      target2[position3++] = length >> 8;
      target2[position3++] = length & 255;
    } else {
      var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(length + 5);
      target2[position3++] = 198;
      targetView2.setUint32(position3, length);
      position3 += 4;
    }
    target2.set(buffer, position3);
  }
  function writeExtensionData(result, target2, position3, type) {
    let length = result.length;
    switch (length) {
      case 1:
        target2[position3++] = 212;
        break;
      case 2:
        target2[position3++] = 213;
        break;
      case 4:
        target2[position3++] = 214;
        break;
      case 8:
        target2[position3++] = 215;
        break;
      case 16:
        target2[position3++] = 216;
        break;
      default:
        if (length < 256) {
          target2[position3++] = 199;
          target2[position3++] = length;
        } else if (length < 65536) {
          target2[position3++] = 200;
          target2[position3++] = length >> 8;
          target2[position3++] = length & 255;
        } else {
          target2[position3++] = 201;
          target2[position3++] = length >> 24;
          target2[position3++] = length >> 16 & 255;
          target2[position3++] = length >> 8 & 255;
          target2[position3++] = length & 255;
        }
    }
    target2[position3++] = type;
    target2.set(result, position3);
    position3 += length;
    return position3;
  }
  function insertIds(serialized, idsToInsert) {
    let nextId;
    let distanceToMove = idsToInsert.length * 6;
    let lastEnd = serialized.length - distanceToMove;
    while (nextId = idsToInsert.pop()) {
      let offset = nextId.offset;
      let id2 = nextId.id;
      serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
      distanceToMove -= 6;
      let position3 = offset + distanceToMove;
      serialized[position3++] = 214;
      serialized[position3++] = 105;
      serialized[position3++] = id2 >> 24;
      serialized[position3++] = id2 >> 16 & 255;
      serialized[position3++] = id2 >> 8 & 255;
      serialized[position3++] = id2 & 255;
      lastEnd = offset;
    }
    return serialized;
  }
  function writeBundles(start, pack2, incrementPosition) {
    if (bundledStrings2.length > 0) {
      targetView.setUint32(bundledStrings2.position + start, position2 + incrementPosition - bundledStrings2.position - start);
      bundledStrings2.stringsPosition = position2 - start;
      let writeStrings = bundledStrings2;
      bundledStrings2 = null;
      pack2(writeStrings[0]);
      pack2(writeStrings[1]);
    }
  }
  function prepareStructures(structures, packr) {
    structures.isCompatible = (existingStructures) => {
      let compatible = !existingStructures || (packr.lastNamedStructuresLength || 0) === existingStructures.length;
      if (!compatible)
        packr._mergeStructures(existingStructures);
      return compatible;
    };
    return structures;
  }
  var defaultPackr = new Packr({ useRecords: false });
  var pack = defaultPackr.pack;
  var encode2 = defaultPackr.pack;
  var { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
  var REUSE_BUFFER_MODE = 512;
  var RESET_BUFFER_MODE = 1024;
  var RESERVE_START_SPACE = 2048;

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/transport/H3Transport.mjs
  var MAX_LENGTH_PREFIX_BYTES = 9;
  var FrameReassembler = class {
    constructor() {
      __publicField(this, "pending", new Uint8Array(0));
    }
    push(chunk) {
      if (!chunk || chunk.byteLength === 0) {
        return [];
      }
      const bytes = this.pending.byteLength === 0 ? chunk : concatBytes2(this.pending, chunk);
      const frames = [];
      let offset = 0;
      while (offset < bytes.byteLength) {
        const it2 = { offset };
        let length;
        try {
          length = decode.number(bytes, it2);
        } catch (e2) {
          if (bytes.byteLength - offset <= MAX_LENGTH_PREFIX_BYTES) {
            break;
          }
          throw e2;
        }
        const frameEnd = it2.offset + length;
        if (frameEnd > bytes.byteLength) {
          break;
        }
        frames.push(bytes.subarray(it2.offset, frameEnd));
        offset = frameEnd;
      }
      this.pending = offset < bytes.byteLength ? bytes.slice(offset) : new Uint8Array(0);
      return frames;
    }
  };
  function concatBytes2(a2, b2) {
    const out = new Uint8Array(a2.byteLength + b2.byteLength);
    out.set(a2, 0);
    out.set(b2, a2.byteLength);
    return out;
  }
  var H3TransportTransport = class {
    constructor(events) {
      __publicField(this, "wt");
      __publicField(this, "isOpen", false);
      __publicField(this, "events");
      __publicField(this, "reader");
      __publicField(this, "writer");
      __publicField(this, "unreliableReader");
      __publicField(this, "unreliableWriter");
      __publicField(this, "lengthPrefixBuffer", new Uint8Array(9));
      // 9 bytes is the maximum length of a length prefix
      __publicField(this, "reliableReassembler", new FrameReassembler());
      __publicField(this, "unreliableReassembler", new FrameReassembler());
      this.events = events;
    }
    connect(url, options = {}) {
      const wtOpts = options.fingerprint && {
        // requireUnreliable: true,
        // congestionControl: "default", // "low-latency" || "throughput"
        serverCertificateHashes: [{
          algorithm: "sha-256",
          value: new Uint8Array(options.fingerprint).buffer
        }]
      } || void 0;
      this.wt = new WebTransport(url, wtOpts);
      this.wt.ready.then((e2) => {
        console.log("WebTransport ready!", e2);
        this.isOpen = true;
        this.unreliableReader = this.wt.datagrams.readable.getReader();
        this.unreliableWriter = this.wt.datagrams.writable.getWriter();
        const incomingBidi = this.wt.incomingBidirectionalStreams.getReader();
        incomingBidi.read().then((stream) => {
          this.reader = stream.value.readable.getReader();
          this.writer = stream.value.writable.getWriter();
          this.sendSeatReservation(options.roomId, options.sessionId, options.reconnectionToken, options.skipHandshake);
          this.readIncomingData();
          this.readIncomingUnreliableData();
        }).catch((e3) => {
          console.error("failed to read incoming stream", e3);
          console.error("TODO: close the connection");
        });
      }).catch((e2) => {
        console.log("WebTransport not ready!", e2);
        this._close();
      });
      this.wt.closed.then((e2) => {
        console.log("WebTransport closed w/ success", e2);
        this.events.onclose({ code: e2.closeCode, reason: e2.reason });
      }).catch((e2) => {
        console.log("WebTransport closed w/ error", e2);
        this.events.onerror(e2);
        this.events.onclose({ code: e2.closeCode, reason: e2.reason });
      }).finally(() => {
        this._close();
      });
    }
    send(data) {
      const prefixLength = encode.number(this.lengthPrefixBuffer, data.length, { offset: 0 });
      const dataWithPrefixedLength = new Uint8Array(prefixLength + data.length);
      dataWithPrefixedLength.set(this.lengthPrefixBuffer.subarray(0, prefixLength), 0);
      dataWithPrefixedLength.set(data, prefixLength);
      this.writer.write(dataWithPrefixedLength);
    }
    sendUnreliable(data) {
      const prefixLength = encode.number(this.lengthPrefixBuffer, data.length, { offset: 0 });
      const dataWithPrefixedLength = new Uint8Array(prefixLength + data.length);
      dataWithPrefixedLength.set(this.lengthPrefixBuffer.subarray(0, prefixLength), 0);
      dataWithPrefixedLength.set(data, prefixLength);
      this.unreliableWriter.write(dataWithPrefixedLength);
    }
    close(code, reason) {
      try {
        this.wt.close({ closeCode: code, reason });
      } catch (e2) {
        console.error(e2);
      }
    }
    async readIncomingData() {
      let result;
      while (this.isOpen) {
        try {
          result = await this.reader.read();
          for (const frame of this.reliableReassembler.push(result.value)) {
            this.events.onmessage({ data: frame });
          }
        } catch (e2) {
          if (e2.message.indexOf("session is closed") === -1) {
            console.error("H3Transport: failed to read incoming data", e2);
          }
          break;
        }
        if (result.done) {
          break;
        }
      }
    }
    async readIncomingUnreliableData() {
      let result;
      while (this.isOpen) {
        try {
          result = await this.unreliableReader.read();
          for (const frame of this.unreliableReassembler.push(result.value)) {
            this.events.onmessage({ data: frame });
          }
        } catch (e2) {
          if (e2.message.indexOf("session is closed") === -1) {
            console.error("H3Transport: failed to read incoming data", e2);
          }
          break;
        }
        if (result.done) {
          break;
        }
      }
    }
    sendSeatReservation(roomId, sessionId, reconnectionToken, skipHandshake) {
      const it2 = { offset: 0 };
      const bytes = [];
      encode.string(bytes, roomId, it2);
      encode.string(bytes, sessionId, it2);
      if (reconnectionToken) {
        encode.string(bytes, reconnectionToken, it2);
      }
      if (skipHandshake) {
        encode.boolean(bytes, 1, it2);
      }
      this.writer.write(new Uint8Array(bytes).buffer);
    }
    _close() {
      this.isOpen = false;
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/transport/WebSocketTransport.mjs
  var import_ws = __toESM(require_browser(), 1);
  var WebSocket = globalThis.WebSocket || import_ws.default;
  var WebSocketTransport = class {
    constructor(events) {
      __publicField(this, "ws");
      __publicField(this, "protocols");
      __publicField(this, "events");
      this.events = events;
    }
    send(data) {
      this.ws.send(data);
    }
    sendUnreliable(data) {
      console.warn("@colyseus/sdk: The WebSocket transport does not support unreliable messages");
    }
    /**
     * @param url URL to connect to
     * @param headers custom headers to send with the connection (only supported in Node.js. Web Browsers do not allow setting custom headers)
     */
    connect(url, headers) {
      try {
        this.ws = new WebSocket(url, { headers, protocols: this.protocols });
      } catch (e2) {
        this.ws = new WebSocket(url, this.protocols);
      }
      this.ws.binaryType = "arraybuffer";
      this.ws.onopen = (event) => this.events.onopen?.(event);
      this.ws.onmessage = (event) => this.events.onmessage?.(event);
      this.ws.onclose = (event) => this.events.onclose?.(event);
      this.ws.onerror = (event) => this.events.onerror?.(event);
    }
    close(code, reason) {
      if (code === CloseCode.MAY_TRY_RECONNECT && this.events.onclose) {
        this.ws.onclose = null;
        this.events.onclose({ code, reason });
      }
      this.ws.close(code, reason);
    }
    get isOpen() {
      return this.ws.readyState === WebSocket.OPEN;
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/Connection.mjs
  var onOfflineListeners = [];
  var hasGlobalEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
  if (hasGlobalEventListeners) {
    addEventListener("offline", () => {
      console.warn(`@colyseus/sdk: \u{1F6D1} Network offline. Closing ${onOfflineListeners.length} connection(s)`);
      onOfflineListeners.forEach((listener) => listener());
    }, false);
  }
  var __offlineListener;
  var Connection = class {
    constructor(protocol) {
      __publicField(this, "transport");
      __publicField(this, "events", {});
      __publicField(this, "url");
      __publicField(this, "options");
      __privateAdd(this, __offlineListener, hasGlobalEventListeners ? () => this.close(CloseCode.MAY_TRY_RECONNECT) : null);
      switch (protocol) {
        case "h3":
          this.transport = new H3TransportTransport(this.events);
          break;
        default:
          this.transport = new WebSocketTransport(this.events);
          break;
      }
    }
    connect(url, options) {
      if (hasGlobalEventListeners) {
        const onOpen = this.events.onopen;
        this.events.onopen = (ev2) => {
          onOfflineListeners.push(__privateGet(this, __offlineListener));
          onOpen?.(ev2);
        };
        const onClose = this.events.onclose;
        this.events.onclose = (ev2) => {
          onOfflineListeners.splice(onOfflineListeners.indexOf(__privateGet(this, __offlineListener)), 1);
          onClose?.(ev2);
        };
      }
      this.url = url;
      this.options = options;
      this.transport.connect(url, options);
    }
    send(data) {
      this.transport.send(data);
    }
    sendUnreliable(data) {
      this.transport.sendUnreliable(data);
    }
    reconnect(queryParams) {
      const url = new URL(this.url);
      for (const key in queryParams) {
        url.searchParams.set(key, queryParams[key]);
      }
      this.transport.connect(url.toString(), this.options);
    }
    close(code, reason) {
      this.transport.close(code, reason);
    }
    get isOpen() {
      return this.transport.isOpen;
    }
  };
  __offlineListener = new WeakMap();

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/serializer/Serializer.mjs
  var serializers = {};
  function registerSerializer(id2, serializer) {
    serializers[id2] = serializer;
  }
  function getSerializer(id2) {
    const serializer = serializers[id2];
    if (!serializer) {
      throw new Error("missing serializer: " + id2);
    }
    return serializer;
  }

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/core/nanoevents.mjs
  var createNanoEvents = () => ({
    emit(event, ...args) {
      let callbacks = this.events[event] || [];
      for (let i2 = 0, length = callbacks.length; i2 < length; i2++) {
        callbacks[i2](...args);
      }
    },
    events: {},
    on(event, cb) {
      this.events[event]?.push(cb) || (this.events[event] = [cb]);
      return () => {
        this.events[event] = this.events[event]?.filter((i2) => cb !== i2);
      };
    }
  });

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/core/signal.mjs
  var EventEmitter2 = class {
    constructor() {
      __publicField(this, "handlers", []);
    }
    register(cb, once = false) {
      this.handlers.push(cb);
      return this;
    }
    invoke(...args) {
      this.handlers.forEach((handler) => handler.apply(this, args));
    }
    invokeAsync(...args) {
      return Promise.all(this.handlers.map((handler) => handler.apply(this, args)));
    }
    remove(cb) {
      const index = this.handlers.indexOf(cb);
      this.handlers[index] = this.handlers[this.handlers.length - 1];
      this.handlers.pop();
    }
    clear() {
      this.handlers = [];
    }
  };
  function createSignal() {
    const emitter = new EventEmitter2();
    function register(cb) {
      return emitter.register(cb, this === null);
    }
    ;
    register.once = (cb) => {
      const callback = function(...args) {
        cb.apply(this, args);
        emitter.remove(callback);
      };
      emitter.register(callback);
    };
    register.remove = (cb) => emitter.remove(cb);
    register.invoke = (...args) => emitter.invoke(...args);
    register.invokeAsync = (...args) => emitter.invokeAsync(...args);
    register.clear = () => emitter.clear();
    return register;
  }

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/serializer/SchemaSerializer.mjs
  var SchemaSerializer = class {
    constructor() {
      __publicField(this, "state");
      __publicField(this, "decoder");
    }
    setState(encodedState, it2) {
      this.decoder.decode(encodedState, it2);
    }
    getState() {
      return this.state;
    }
    patch(patches, it2) {
      return this.decoder.decode(patches, it2);
    }
    teardown() {
      this.decoder.root.clearRefs();
    }
    handshake(bytes, it2) {
      if (this.state) {
        Reflection.decode(bytes, it2);
        this.decoder = new Decoder(this.state);
      } else {
        this.decoder = Reflection.decode(bytes, it2);
        this.state = this.decoder.state;
      }
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/core/utils.mjs
  function now() {
    return typeof performance !== "undefined" ? performance.now() : Date.now();
  }

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/Room.mjs
  var _lastPingTime, _pingCallback;
  var Room = class {
    constructor(name, rootSchema) {
      __publicField(this, "roomId");
      __publicField(this, "sessionId");
      __publicField(this, "reconnectionToken");
      __publicField(this, "name");
      __publicField(this, "connection");
      // Public signals
      __publicField(this, "onStateChange", createSignal());
      __publicField(this, "onError", createSignal());
      __publicField(this, "onLeave", createSignal());
      __publicField(this, "onReconnect", createSignal());
      __publicField(this, "onDrop", createSignal());
      __publicField(this, "onJoin", createSignal());
      __publicField(this, "serializerId");
      __publicField(this, "serializer");
      // reconnection logic
      __publicField(this, "reconnection", {
        enabled: true,
        retryCount: 0,
        maxRetries: 15,
        delay: 100,
        minDelay: 100,
        maxDelay: 5e3,
        minUptime: 5e3,
        backoff: exponentialBackoff,
        maxEnqueuedMessages: 10,
        enqueuedMessages: [],
        isReconnecting: false
      });
      __publicField(this, "joinedAtTime", 0);
      __publicField(this, "onMessageHandlers", createNanoEvents());
      __publicField(this, "packr");
      __privateAdd(this, _lastPingTime, 0);
      __privateAdd(this, _pingCallback);
      this.name = name;
      this.packr = new Packr();
      this.packr.encode(void 0);
      if (rootSchema) {
        const serializer = new (getSerializer("schema"))();
        this.serializer = serializer;
        const state = new rootSchema();
        serializer.state = state;
        serializer.decoder = new Decoder(state);
      }
      this.onLeave(() => {
        this.removeAllListeners();
        this.destroy();
      });
    }
    connect(endpoint, options, headers) {
      this.connection = new Connection(options.protocol);
      this.connection.events.onmessage = this.onMessageCallback.bind(this);
      this.connection.events.onclose = (e2) => {
        if (this.joinedAtTime === 0) {
          console.warn?.(`Room connection was closed unexpectedly (${e2.code}): ${e2.reason}`);
          this.onError.invoke(e2.code, e2.reason);
          return;
        }
        if (e2.code === CloseCode.NO_STATUS_RECEIVED || e2.code === CloseCode.ABNORMAL_CLOSURE || e2.code === CloseCode.GOING_AWAY || e2.code === CloseCode.MAY_TRY_RECONNECT) {
          this.onDrop.invoke(e2.code, e2.reason);
          this.handleReconnection(e2.code, e2.reason);
        } else {
          this.onLeave.invoke(e2.code, e2.reason);
        }
      };
      this.connection.events.onerror = (e2) => {
        this.onError.invoke(e2.code, e2.reason);
      };
      const skipHandshake = this.serializer?.getState() !== void 0;
      if (options.protocol === "h3") {
        const url = new URL(endpoint);
        this.connection.connect(url.origin, { ...options, skipHandshake });
      } else {
        this.connection.connect(`${endpoint}${skipHandshake ? "&skipHandshake=1" : ""}`, headers);
      }
    }
    leave(consented = true) {
      return new Promise((resolve) => {
        this.onLeave((code) => resolve(code));
        if (this.connection) {
          if (consented) {
            this.packr.buffer[0] = Protocol.LEAVE_ROOM;
            this.connection.send(this.packr.buffer.subarray(0, 1));
          } else {
            this.connection.close();
          }
        } else {
          this.onLeave.invoke(CloseCode.CONSENTED);
        }
      });
    }
    onMessage(type, callback) {
      return this.onMessageHandlers.on(this.getMessageHandlerKey(type), callback);
    }
    ping(callback) {
      if (!this.connection?.isOpen) {
        return;
      }
      __privateSet(this, _lastPingTime, now());
      __privateSet(this, _pingCallback, callback);
      this.packr.buffer[0] = Protocol.PING;
      this.connection.send(this.packr.buffer.subarray(0, 1));
    }
    send(messageType, payload) {
      const it2 = { offset: 1 };
      this.packr.buffer[0] = Protocol.ROOM_DATA;
      if (typeof messageType === "string") {
        encode.string(this.packr.buffer, messageType, it2);
      } else {
        encode.number(this.packr.buffer, messageType, it2);
      }
      this.packr.position = 0;
      const data = payload !== void 0 ? this.packr.pack(payload, 2048 + it2.offset) : this.packr.buffer.subarray(0, it2.offset);
      if (!this.connection.isOpen) {
        enqueueMessage(this, new Uint8Array(data));
      } else {
        this.connection.send(data);
      }
    }
    sendUnreliable(type, message) {
      if (!this.connection.isOpen) {
        return;
      }
      const it2 = { offset: 1 };
      this.packr.buffer[0] = Protocol.ROOM_DATA;
      if (typeof type === "string") {
        encode.string(this.packr.buffer, type, it2);
      } else {
        encode.number(this.packr.buffer, type, it2);
      }
      this.packr.position = 0;
      const data = message !== void 0 ? this.packr.pack(message, 2048 + it2.offset) : this.packr.buffer.subarray(0, it2.offset);
      this.connection.sendUnreliable(data);
    }
    sendBytes(type, bytes) {
      const it2 = { offset: 1 };
      this.packr.buffer[0] = Protocol.ROOM_DATA_BYTES;
      if (typeof type === "string") {
        encode.string(this.packr.buffer, type, it2);
      } else {
        encode.number(this.packr.buffer, type, it2);
      }
      if (bytes.byteLength + it2.offset > this.packr.buffer.byteLength) {
        const newBuffer = new Uint8Array(it2.offset + bytes.byteLength);
        newBuffer.set(this.packr.buffer);
        this.packr.useBuffer(newBuffer);
      }
      this.packr.buffer.set(bytes, it2.offset);
      if (!this.connection.isOpen) {
        enqueueMessage(this, this.packr.buffer.subarray(0, it2.offset + bytes.byteLength));
      } else {
        this.connection.send(this.packr.buffer.subarray(0, it2.offset + bytes.byteLength));
      }
    }
    get state() {
      return this.serializer.getState();
    }
    removeAllListeners() {
      this.onJoin.clear();
      this.onStateChange.clear();
      this.onError.clear();
      this.onLeave.clear();
      this.onReconnect.clear();
      this.onDrop.clear();
      this.onMessageHandlers.events = {};
      if (this.serializer instanceof SchemaSerializer) {
        this.serializer.decoder.root.callbacks = {};
      }
    }
    onMessageCallback(event) {
      var _a7;
      const buffer = new Uint8Array(event.data);
      const it2 = { offset: 1 };
      const code = buffer[0];
      if (code === Protocol.JOIN_ROOM) {
        const reconnectionToken = decode.utf8Read(buffer, it2, buffer[it2.offset++]);
        this.serializerId = decode.utf8Read(buffer, it2, buffer[it2.offset++]);
        if (!this.serializer) {
          const serializer = getSerializer(this.serializerId);
          this.serializer = new serializer();
        }
        if (buffer.byteLength > it2.offset && this.serializer.handshake) {
          this.serializer.handshake(buffer, it2);
        }
        if (this.joinedAtTime === 0) {
          this.joinedAtTime = Date.now();
          this.onJoin.invoke();
        } else {
          console.info(`[Colyseus reconnection]: ${String.fromCodePoint(9989)} reconnection successful!`);
          this.reconnection.isReconnecting = false;
          this.onReconnect.invoke();
        }
        this.reconnectionToken = `${this.roomId}:${reconnectionToken}`;
        this.packr.buffer[0] = Protocol.JOIN_ROOM;
        this.connection.send(this.packr.buffer.subarray(0, 1));
        if (this.reconnection.enqueuedMessages.length > 0) {
          for (const message of this.reconnection.enqueuedMessages) {
            this.connection.send(message.data);
          }
          this.reconnection.enqueuedMessages = [];
        }
      } else if (code === Protocol.ERROR) {
        const code2 = decode.number(buffer, it2);
        const message = decode.string(buffer, it2);
        this.onError.invoke(code2, message);
      } else if (code === Protocol.LEAVE_ROOM) {
        this.leave();
      } else if (code === Protocol.ROOM_STATE) {
        this.serializer.setState(buffer, it2);
        this.onStateChange.invoke(this.serializer.getState());
      } else if (code === Protocol.ROOM_STATE_PATCH) {
        this.serializer.patch(buffer, it2);
        this.onStateChange.invoke(this.serializer.getState());
      } else if (code === Protocol.ROOM_DATA) {
        const type = decode.stringCheck(buffer, it2) ? decode.string(buffer, it2) : decode.number(buffer, it2);
        const message = buffer.byteLength > it2.offset ? unpack(buffer, { start: it2.offset }) : void 0;
        this.dispatchMessage(type, message);
      } else if (code === Protocol.ROOM_DATA_BYTES) {
        const type = decode.stringCheck(buffer, it2) ? decode.string(buffer, it2) : decode.number(buffer, it2);
        this.dispatchMessage(type, buffer.subarray(it2.offset));
      } else if (code === Protocol.PING) {
        (_a7 = __privateGet(this, _pingCallback)) == null ? void 0 : _a7.call(this, Math.round(now() - __privateGet(this, _lastPingTime)));
        __privateSet(this, _pingCallback, void 0);
      }
    }
    dispatchMessage(type, message) {
      const messageType = this.getMessageHandlerKey(type);
      if (this.onMessageHandlers.events[messageType]) {
        this.onMessageHandlers.emit(messageType, message);
      } else if (this.onMessageHandlers.events["*"]) {
        this.onMessageHandlers.emit("*", type, message);
      } else if (!messageType.startsWith("__")) {
        console.warn?.(`@colyseus/sdk: onMessage() not registered for type '${type}'.`);
      }
    }
    destroy() {
      if (this.serializer) {
        this.serializer.teardown();
      }
    }
    getMessageHandlerKey(type) {
      switch (typeof type) {
        // string
        case "string":
          return type;
        // number
        case "number":
          return `i${type}`;
        default:
          throw new Error("invalid message type.");
      }
    }
    handleReconnection(code, reason) {
      if (!this.reconnection.enabled) {
        this.onLeave.invoke(code, reason);
        return;
      }
      if (Date.now() - this.joinedAtTime < this.reconnection.minUptime) {
        console.info(`[Colyseus reconnection]: ${String.fromCodePoint(10060)} Room has not been up for long enough for automatic reconnection. (min uptime: ${this.reconnection.minUptime}ms)`);
        this.onLeave.invoke(CloseCode.ABNORMAL_CLOSURE, "Room uptime too short for reconnection.");
        return;
      }
      if (!this.reconnection.isReconnecting) {
        this.reconnection.retryCount = 0;
        this.reconnection.isReconnecting = true;
      }
      this.retryReconnection();
    }
    retryReconnection() {
      if (this.reconnection.retryCount >= this.reconnection.maxRetries) {
        console.info(`[Colyseus reconnection]: ${String.fromCodePoint(10060)} \u274C Reconnection failed after ${this.reconnection.maxRetries} attempts.`);
        this.reconnection.isReconnecting = false;
        this.onLeave.invoke(CloseCode.FAILED_TO_RECONNECT, "No more retries. Reconnection failed.");
        return;
      }
      this.reconnection.retryCount++;
      const delay = Math.min(this.reconnection.maxDelay, Math.max(this.reconnection.minDelay, this.reconnection.backoff(this.reconnection.retryCount, this.reconnection.delay)));
      console.info(`[Colyseus reconnection]: ${String.fromCodePoint(9203)} will retry in ${(delay / 1e3).toFixed(1)} seconds...`);
      setTimeout(() => {
        try {
          console.info(`[Colyseus reconnection]: ${String.fromCodePoint(128260)} Re-establishing sessionId '${this.sessionId}' with roomId '${this.roomId}'... (attempt ${this.reconnection.retryCount} of ${this.reconnection.maxRetries})`);
          this.connection.reconnect({
            reconnectionToken: this.reconnectionToken.split(":")[1],
            skipHandshake: true
            // we already applied the handshake on first join
          });
        } catch (e2) {
          this.retryReconnection();
        }
      }, delay);
    }
  };
  _lastPingTime = new WeakMap();
  _pingCallback = new WeakMap();
  var exponentialBackoff = (attempt, delay) => {
    return Math.floor(Math.pow(2, attempt) * delay);
  };
  function enqueueMessage(room, message) {
    room.reconnection.enqueuedMessages.push({ data: message });
    if (room.reconnection.enqueuedMessages.length > room.reconnection.maxEnqueuedMessages) {
      room.reconnection.enqueuedMessages.shift();
    }
  }

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/fetchXHR.mjs
  function xhrFetch(url, init) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const method = init?.method || "GET";
      xhr.open(method, url.toString());
      xhr.withCredentials = init?.credentials === "include";
      if (init?.headers) {
        const headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
        headers.forEach((value, key) => {
          xhr.setRequestHeader(key, value);
        });
      }
      xhr.onload = () => {
        const headers = new Headers();
        const rawHeaders = xhr.getAllResponseHeaders().trim();
        if (rawHeaders) {
          for (const line of rawHeaders.split(/[\r\n]+/)) {
            const idx = line.indexOf(": ");
            if (idx > 0) {
              headers.append(line.substring(0, idx), line.substring(idx + 2));
            }
          }
        }
        const responseBody = xhr.response ?? xhr.responseText;
        resolve(new XHRResponse(responseBody, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers
        }));
      };
      xhr.onerror = () => reject(new TypeError("Network request failed"));
      xhr.ontimeout = () => reject(new TypeError("Network request timed out"));
      xhr.send(init?.body ?? null);
    });
  }
  var XHRResponse = class {
    constructor(body, init) {
      __publicField(this, "status");
      __publicField(this, "statusText");
      __publicField(this, "headers");
      __publicField(this, "ok");
      __publicField(this, "body");
      this.body = body;
      this.status = init.status;
      this.statusText = init.statusText;
      this.headers = init.headers;
      this.ok = init.status >= 200 && init.status < 300;
    }
    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }
    async text() {
      return typeof this.body === "string" ? this.body : JSON.stringify(this.body);
    }
    async blob() {
      return new Blob([this.body]);
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/HTTP.mjs
  function isJSONSerializable(value) {
    if (value === void 0) {
      return false;
    }
    const t4 = typeof value;
    if (t4 === "string" || t4 === "number" || t4 === "boolean" || t4 === null) {
      return true;
    }
    if (t4 !== "object") {
      return false;
    }
    if (Array.isArray(value)) {
      return true;
    }
    if (value.buffer) {
      return false;
    }
    return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
  }
  function getURLWithQueryParams(url, option) {
    const { params, query } = option || {};
    const [urlPath, urlQuery] = url.split("?");
    let path = urlPath;
    if (params) {
      if (Array.isArray(params)) {
        const paramPaths = path.split("/").filter((p2) => p2.startsWith(":"));
        for (const [index, key] of paramPaths.entries()) {
          const value = params[index];
          path = path.replace(key, value);
        }
      } else {
        for (const [key, value] of Object.entries(params)) {
          path = path.replace(`:${key}`, String(value));
        }
      }
    }
    const queryParams = new URLSearchParams(urlQuery);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value == null)
          continue;
        queryParams.set(key, String(value));
      }
    }
    let queryParamString = queryParams.toString();
    queryParamString = queryParamString.length > 0 ? `?${queryParamString}`.replace(/\+/g, "%20") : "";
    return `${path}${queryParamString}`;
  }
  var HTTP = class {
    constructor(sdk, baseOptions, fetchFn) {
      __publicField(this, "authToken");
      __publicField(this, "options");
      __publicField(this, "sdk");
      __publicField(this, "_fetchFn");
      // alias "del()" to "delete()"
      __publicField(this, "del", this.delete);
      this.sdk = sdk;
      this.options = baseOptions;
      this._fetchFn = fetchFn;
    }
    /**
     * Lazily resolve the fetch implementation.
     * Falls back to XMLHttpRequest when fetch is unavailable (e.g. Cocos Creator Native).
     */
    get fetchFn() {
      if (!this._fetchFn) {
        this._fetchFn = typeof globalThis.fetch !== "undefined" ? globalThis.fetch.bind(globalThis) : xhrFetch;
      }
      return this._fetchFn;
    }
    async request(method, path, options) {
      return this.executeRequest(method, path, options);
    }
    get(path, options) {
      return this.request("GET", path, options);
    }
    post(path, options) {
      return this.request("POST", path, options);
    }
    delete(path, options) {
      return this.request("DELETE", path, options);
    }
    patch(path, options) {
      return this.request("PATCH", path, options);
    }
    put(path, options) {
      return this.request("PUT", path, options);
    }
    async executeRequest(method, path, requestOptions) {
      let body = this.options.body ? { ...this.options.body, ...requestOptions?.body || {} } : requestOptions?.body;
      const query = this.options.query ? { ...this.options.query, ...requestOptions?.query || {} } : requestOptions?.query;
      const params = this.options.params ? { ...this.options.params, ...requestOptions?.params || {} } : requestOptions?.params;
      const headers = new Headers(this.options.headers ? { ...this.options.headers, ...requestOptions?.headers || {} } : requestOptions?.headers);
      if (this.authToken && !headers.has("authorization")) {
        headers.set("authorization", `Bearer ${this.authToken}`);
      }
      if (isJSONSerializable(body) && typeof body === "object" && body !== null) {
        if (!headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
        for (const [key, value] of Object.entries(body)) {
          if (value instanceof Date) {
            body[key] = value.toISOString();
          }
        }
        body = JSON.stringify(body);
      }
      const mergedOptions = {
        credentials: requestOptions?.credentials || "include",
        ...this.options,
        ...requestOptions,
        query,
        params,
        headers,
        body,
        method
      };
      const url = getURLWithQueryParams(this.sdk["getHttpEndpoint"](path.toString()), mergedOptions);
      let raw;
      try {
        raw = await this.fetchFn(url, mergedOptions);
      } catch (err) {
        if (err.name === "AbortError") {
          throw err;
        }
        const networkError = new ServerError(err.cause?.code || err.code, err.message);
        networkError.response = raw;
        networkError.cause = err.cause;
        throw networkError;
      }
      const contentType = raw.headers.get("content-type");
      let data;
      if (contentType?.includes("json")) {
        data = await raw.json();
      } else if (contentType?.includes("text")) {
        data = await raw.text();
      } else {
        data = await raw.blob();
      }
      if (!raw.ok) {
        throw new ServerError(raw.status, data.message ?? data.error ?? raw.statusText, {
          headers: raw.headers,
          status: raw.status,
          response: raw,
          data
        });
      }
      return {
        raw,
        data,
        headers: raw.headers,
        status: raw.status,
        statusText: raw.statusText
      };
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/Storage.mjs
  var storage;
  function getStorage() {
    if (!storage) {
      try {
        storage = typeof cc !== "undefined" && cc.sys && cc.sys.localStorage ? cc.sys.localStorage : window.localStorage;
      } catch (e2) {
      }
    }
    if (!storage && typeof globalThis.indexedDB !== "undefined") {
      storage = new IndexedDBStorage();
    }
    if (!storage) {
      storage = {
        cache: {},
        setItem: function(key, value) {
          this.cache[key] = value;
        },
        getItem: function(key) {
          this.cache[key];
        },
        removeItem: function(key) {
          delete this.cache[key];
        }
      };
    }
    return storage;
  }
  function setItem(key, value) {
    getStorage().setItem(key, value);
  }
  function removeItem(key) {
    getStorage().removeItem(key);
  }
  function getItem(key, callback) {
    const value = getStorage().getItem(key);
    if (typeof Promise === "undefined" || // old browsers
    !(value instanceof Promise)) {
      callback(value);
    } else {
      value.then((id2) => callback(id2));
    }
  }
  var IndexedDBStorage = class {
    constructor() {
      __publicField(this, "dbPromise", new Promise((resolve) => {
        const request = indexedDB.open("_colyseus_storage", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("store");
        request.onsuccess = () => resolve(request.result);
      }));
    }
    async tx(mode, fn2) {
      const db = await this.dbPromise;
      const store = db.transaction("store", mode).objectStore("store");
      return fn2(store);
    }
    setItem(key, value) {
      return this.tx("readwrite", (store) => store.put(value, key)).then();
    }
    async getItem(key) {
      const request = await this.tx("readonly", (store) => store.get(key));
      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
      });
    }
    removeItem(key) {
      return this.tx("readwrite", (store) => store.delete(key)).then();
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/Auth.mjs
  var __initialized, __signInWindow, __events;
  var Auth = class {
    constructor(http) {
      __publicField(this, "settings", {
        path: "/auth",
        key: "colyseus-auth-token"
      });
      __privateAdd(this, __initialized, false);
      __privateAdd(this, __signInWindow, null);
      __privateAdd(this, __events, createNanoEvents());
      __publicField(this, "http");
      this.http = http;
      getItem(this.settings.key, (token) => this.token = token);
    }
    set token(token) {
      this.http.authToken = token;
    }
    get token() {
      return this.http.authToken;
    }
    onChange(callback) {
      const unbindChange = __privateGet(this, __events).on("change", callback);
      if (!__privateGet(this, __initialized)) {
        this.getUserData().then((userData) => {
          this.emitChange({ ...userData, token: this.token });
        }).catch((e2) => {
          this.emitChange({ user: null, token: void 0 });
        });
      }
      __privateSet(this, __initialized, true);
      return unbindChange;
    }
    async getUserData() {
      if (this.token) {
        return (await this.http.get(`${this.settings.path}/userdata`)).data;
      } else {
        throw new Error("missing auth.token");
      }
    }
    async registerWithEmailAndPassword(email, password, options) {
      const data = (await this.http.post(`${this.settings.path}/register`, {
        body: { email, password, options }
      })).data;
      this.emitChange(data);
      return data;
    }
    async signInWithEmailAndPassword(email, password) {
      const data = (await this.http.post(`${this.settings.path}/login`, {
        body: { email, password }
      })).data;
      this.emitChange(data);
      return data;
    }
    async signInAnonymously(options) {
      const data = (await this.http.post(`${this.settings.path}/anonymous`, {
        body: { options }
      })).data;
      this.emitChange(data);
      return data;
    }
    async sendPasswordResetEmail(email) {
      return (await this.http.post(`${this.settings.path}/forgot-password`, {
        body: { email }
      })).data;
    }
    async signInWithProvider(providerName, settings = {}) {
      return new Promise((resolve, reject) => {
        const w2 = settings.width || 480;
        const h2 = settings.height || 768;
        const upgradingToken = this.token ? `?token=${this.token}` : "";
        const title = `Login with ${providerName[0].toUpperCase() + providerName.substring(1)}`;
        const url = this.http["sdk"]["getHttpEndpoint"](`${settings.prefix || `${this.settings.path}/provider`}/${providerName}${upgradingToken}`);
        const left = screen.width / 2 - w2 / 2;
        const top = screen.height / 2 - h2 / 2;
        __privateSet(this, __signInWindow, window.open(url, title, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + w2 + ", height=" + h2 + ", top=" + top + ", left=" + left));
        const onMessage = (event) => {
          if (event.data.user === void 0 && event.data.token === void 0) {
            return;
          }
          clearInterval(rejectionChecker);
          __privateGet(this, __signInWindow)?.close();
          __privateSet(this, __signInWindow, null);
          window.removeEventListener("message", onMessage);
          if (event.data.error !== void 0) {
            reject(event.data.error);
          } else {
            resolve(event.data);
            this.emitChange(event.data);
          }
        };
        const rejectionChecker = setInterval(() => {
          if (!__privateGet(this, __signInWindow) || __privateGet(this, __signInWindow).closed) {
            __privateSet(this, __signInWindow, null);
            reject("cancelled");
            window.removeEventListener("message", onMessage);
          }
        }, 200);
        window.addEventListener("message", onMessage);
      });
    }
    async signOut() {
      this.emitChange({ user: null, token: null });
    }
    emitChange(authData) {
      if (authData.token !== void 0) {
        this.token = authData.token;
        if (authData.token === null) {
          removeItem(this.settings.key);
        } else {
          setItem(this.settings.key, authData.token);
        }
      }
      __privateGet(this, __events).emit("change", authData);
    }
  };
  __initialized = new WeakMap();
  __signInWindow = new WeakMap();
  __events = new WeakMap();

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/3rd_party/discord.mjs
  function discordURLBuilder(url) {
    const localHostname = window?.location?.hostname || "localhost";
    const remoteHostnameSplitted = url.hostname.split(".");
    const subdomain = !url.hostname.includes("trycloudflare.com") && // ignore cloudflared subdomains
    !url.hostname.includes("discordsays.com") && // ignore discordsays.com subdomains
    remoteHostnameSplitted.length > 2 ? `/${remoteHostnameSplitted[0]}` : "";
    return url.pathname.startsWith("/.proxy") ? `${url.protocol}//${localHostname}${subdomain}${url.pathname}${url.search}` : `${url.protocol}//${localHostname}/.proxy/colyseus${subdomain}${url.pathname}${url.search}`;
  }

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/Client.mjs
  var DEFAULT_ENDPOINT = typeof window !== "undefined" && typeof window?.location?.hostname !== "undefined" ? `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${window.location.port && `:${window.location.port}`}` : "ws://127.0.0.1:2567";
  var _ColyseusSDK = class _ColyseusSDK {
    constructor(settings = DEFAULT_ENDPOINT, options) {
      /**
       * The HTTP client to make requests to the server.
       */
      __publicField(this, "http");
      /**
       * The authentication module to authenticate into requests and rooms.
       */
      __publicField(this, "auth");
      /**
       * The settings used to connect to the server.
       */
      __publicField(this, "settings");
      __publicField(this, "urlBuilder");
      if (typeof settings === "string") {
        const url = settings.startsWith("/") ? new URL(settings, DEFAULT_ENDPOINT) : new URL(settings);
        const secure = url.protocol === "https:" || url.protocol === "wss:";
        const port = Number(url.port || (secure ? 443 : 80));
        this.settings = {
          hostname: url.hostname,
          pathname: url.pathname,
          port,
          secure,
          searchParams: url.searchParams.toString() || void 0
        };
      } else {
        if (settings.port === void 0) {
          settings.port = settings.secure ? 443 : 80;
        }
        if (settings.pathname === void 0) {
          settings.pathname = "";
        }
        this.settings = settings;
      }
      if (this.settings.pathname.endsWith("/")) {
        this.settings.pathname = this.settings.pathname.slice(0, -1);
      }
      if (options?.protocol) {
        this.settings.protocol = options.protocol;
      }
      this.http = new HTTP(this, {
        headers: options?.headers || {}
      }, options?.fetchFn);
      this.auth = new Auth(this.http);
      this.urlBuilder = options?.urlBuilder;
      if (!this.urlBuilder && typeof window !== "undefined" && window?.location?.hostname?.includes("discordsays.com")) {
        this.urlBuilder = discordURLBuilder;
        console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder.");
      }
    }
    /**
     * Select the endpoint with the lowest latency.
     * @param endpoints Array of endpoints to select from.
     * @param options Client options.
     * @param latencyOptions Latency measurement options (protocol, pingCount, timeout) — forwarded to each {@link getLatency} call.
     * @returns The client with the lowest latency.
     */
    static async selectByLatency(endpoints, options, latencyOptions = {}) {
      const clients = endpoints.map((endpoint) => new _ColyseusSDK(endpoint, options));
      const latencies = (await Promise.allSettled(clients.map((client, index) => client.getLatency(latencyOptions).then((latency) => {
        const settings = clients[index].settings;
        console.log(`\u{1F6DC} Endpoint Latency: ${latency}ms - ${settings.hostname}:${settings.port}${settings.pathname}`);
        return [index, latency];
      })))).filter((result) => result.status === "fulfilled").map((result) => result.value);
      if (latencies.length === 0) {
        throw new Error("All endpoints failed to respond");
      }
      return clients[latencies.sort((a2, b2) => a2[1] - b2[1])[0][0]];
    }
    // Implementation
    async joinOrCreate(roomName, options = {}, rootSchema) {
      return await this.createMatchMakeRequest("joinOrCreate", roomName, options, rootSchema);
    }
    // Implementation
    async create(roomName, options = {}, rootSchema) {
      return await this.createMatchMakeRequest("create", roomName, options, rootSchema);
    }
    // Implementation
    async join(roomName, options = {}, rootSchema) {
      return await this.createMatchMakeRequest("join", roomName, options, rootSchema);
    }
    // Implementation
    async joinById(roomId, options = {}, rootSchema) {
      return await this.createMatchMakeRequest("joinById", roomId, options, rootSchema);
    }
    // Implementation
    async reconnect(reconnectionToken, rootSchema) {
      if (typeof reconnectionToken === "string" && typeof rootSchema === "string") {
        throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");
      }
      const [roomId, token] = reconnectionToken.split(":");
      if (!roomId || !token) {
        throw new Error("Invalid reconnection token format.\nThe format should be roomId:reconnectionToken");
      }
      return await this.createMatchMakeRequest("reconnect", roomId, { reconnectionToken: token }, rootSchema);
    }
    async consumeSeatReservation(response, rootSchema) {
      const room = this.createRoom(response.name, rootSchema);
      room.roomId = response.roomId;
      room.sessionId = response.sessionId;
      const options = { sessionId: room.sessionId };
      if (response.reconnectionToken) {
        options.reconnectionToken = response.reconnectionToken;
      }
      room.connect(this.buildEndpoint(response, options), response, this.http.options.headers);
      return new Promise((resolve, reject) => {
        const onError = (code, message) => reject(new ServerError(code, message));
        room.onError.once(onError);
        room["onJoin"].once(() => {
          room.onError.remove(onError);
          resolve(room);
        });
      });
    }
    /**
     * Create a new connection with the server, and measure the latency.
     *
     * Always settles: resolves with the (average) round-trip time, or rejects on
     * connection error, server-side close before all pongs arrive, or timeout.
     *
     * @param options Latency measurement options (protocol, pingCount, timeout).
     */
    getLatency(options = {}) {
      const protocol = options.protocol ?? "ws";
      const pingCount = options.pingCount ?? 1;
      const timeout = options.timeout ?? 1500;
      return new Promise((resolve, reject) => {
        const conn = new Connection(protocol);
        const latencies = [];
        let pingStart = 0;
        let settled = false;
        let timeoutId;
        const settle = (run) => {
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timeoutId);
          try {
            conn.close();
          } catch (e2) {
          }
          run();
        };
        const fail = (message) => settle(() => reject(new ServerError(CloseCode.ABNORMAL_CLOSURE, `Failed to get latency: ${message}`)));
        timeoutId = setTimeout(() => fail(`timed out after ${timeout}ms`), timeout);
        conn.events.onopen = () => {
          pingStart = Date.now();
          conn.send(new Uint8Array([Protocol.PING]));
        };
        conn.events.onmessage = (_2) => {
          latencies.push(Date.now() - pingStart);
          if (latencies.length < pingCount) {
            pingStart = Date.now();
            conn.send(new Uint8Array([Protocol.PING]));
          } else {
            const average = latencies.reduce((sum, l2) => sum + l2, 0) / latencies.length;
            settle(() => resolve(average));
          }
        };
        conn.events.onclose = (event) => fail(`connection closed${event?.code ? ` (${event.code})` : ""}${event?.reason ? `: ${event.reason}` : ""}`);
        conn.events.onerror = (event) => fail(event.message);
        try {
          conn.connect(this.getHttpEndpoint());
        } catch (e2) {
          fail(e2?.message ?? "failed to connect");
        }
      });
    }
    async createMatchMakeRequest(method, roomName, options = {}, rootSchema) {
      try {
        if (!roomName) {
          throw new Error("Must provide a room name");
        }
        const httpResponse = await this.http.post(`/matchmake/${method}/${roomName}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: options
        });
        const response = httpResponse.data;
        if (method === "reconnect") {
          response.reconnectionToken = options.reconnectionToken;
        }
        return await this.consumeSeatReservation(response, rootSchema);
      } catch (error) {
        if (error instanceof ServerError) {
          throw new MatchMakeError(error.message, error.code);
        }
        throw error;
      }
    }
    createRoom(roomName, rootSchema) {
      return new Room(roomName, rootSchema);
    }
    buildEndpoint(seatReservation, options = {}) {
      let protocol = this.settings.protocol || "ws";
      let searchParams = this.settings.searchParams || "";
      if (this.http.authToken) {
        options["_authToken"] = this.http.authToken;
      }
      for (const name in options) {
        if (!options.hasOwnProperty(name)) {
          continue;
        }
        searchParams += (searchParams ? "&" : "") + `${name}=${options[name]}`;
      }
      if (protocol === "h3") {
        protocol = "http";
      }
      let endpoint = this.settings.secure ? `${protocol}s://` : `${protocol}://`;
      if (seatReservation.publicAddress) {
        endpoint += `${seatReservation.publicAddress}`;
      } else {
        endpoint += `${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;
      }
      const endpointURL = `${endpoint}/${seatReservation.processId}/${seatReservation.roomId}?${searchParams}`;
      return this.urlBuilder ? this.urlBuilder(new URL(endpointURL)) : endpointURL;
    }
    getHttpEndpoint(segments = "") {
      const path = segments.startsWith("/") ? segments : `/${segments}`;
      let endpointURL = `${this.settings.secure ? "https" : "http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${path}`;
      if (this.settings.searchParams) {
        endpointURL += `?${this.settings.searchParams}`;
      }
      return this.urlBuilder ? this.urlBuilder(new URL(endpointURL)) : endpointURL;
    }
    getEndpointPort() {
      return this.settings.port !== 80 && this.settings.port !== 443 ? `:${this.settings.port}` : "";
    }
  };
  __publicField(_ColyseusSDK, "VERSION", "0.17");
  var ColyseusSDK = _ColyseusSDK;
  var Client = ColyseusSDK;

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/serializer/NoneSerializer.mjs
  var NoneSerializer = class {
    setState(rawState) {
    }
    getState() {
      return null;
    }
    patch(patches) {
    }
    teardown() {
    }
    handshake(bytes) {
    }
  };

  // ../../node_modules/.pnpm/@colyseus+sdk@0.17.43_@colyseus+core@0.17.43_typescript@6.0.3/node_modules/@colyseus/sdk/build/index.mjs
  registerSerializer("schema", SchemaSerializer);
  registerSerializer("none", NoneSerializer);

  // src/controllers/game-controller.js
  var ROOM_NAME = "mahjong_room";
  var CLIENT_MESSAGES = {
    MahjongAction: "mahjong_action"
  };
  var SERVER_MESSAGES = {
    MahjongSnapshot: "mahjong_snapshot",
    MahjongError: "mahjong_error"
  };
  var GameController = class {
    constructor(view2, authSession = null, roomOptions = {}) {
      this.view = view2;
      this.authSession = authSession;
      this.roomOptions = roomOptions;
      this.roomId = roomOptions.roomId || "";
      this.clientId = createClientId();
      this.client = null;
      this.online = false;
      this.room = null;
      if (authSession && authSession.token) {
        this.connect();
      } else {
        this.handleMissingAuth();
      }
    }
    // --- Public API ---
    setAuthSession(authSession) {
      this.authSession = authSession;
      if (authSession && authSession.token && !this.online) {
        this.connect();
      }
    }
    restart() {
      if (this.online) this.sendAction("restart");
      else this.showDisconnectedError();
    }
    ready() {
      if (this.online) this.sendAction("ready");
      else this.showDisconnectedError();
    }
    leave() {
      if (this.online) this.sendAction("leave");
      else this.showDisconnectedError();
    }
    discard(index) {
      if (this.online) this.sendAction("discard", { index });
      else this.showDisconnectedError();
    }
    pass() {
      if (this.online) this.sendAction("pass");
      else this.showDisconnectedError();
    }
    peng() {
      if (this.online) this.sendAction("peng");
      else this.showDisconnectedError();
    }
    gang(tile = null) {
      if (this.online) this.sendAction("gang", tile ? { tile } : {});
      else this.showDisconnectedError();
    }
    hu() {
      if (this.online) this.sendAction("hu");
      else this.showDisconnectedError();
    }
    // --- Connection ---
    async connect() {
      this.closeRoom();
      this.view.renderState(createStatusState("\u6B63\u5728\u8FDE\u63A5\u591A\u4EBA\u724C\u5C40..."));
      try {
        const user = this.authSession && this.authSession.user || {};
        const options = {
          token: this.authSession.token,
          name: user.displayName || user.name || "player",
          password: this.roomOptions.password || "",
          timeoutSeconds: this.roomOptions.timeoutSeconds || 30
        };
        const client = this.createColyseusClient();
        const room = await client.joinOrCreate(ROOM_NAME, options, this.roomId);
        this.client = client;
        this.room = room;
        this.online = true;
        this.roomId = room.roomId || room.id || this.roomId;
        this.bindRoom(room);
      } catch (error) {
        console.warn("[wx-mahjong] multiplayer connect failed", error);
        this.handleConnectError(error);
      }
    }
    handleConnectError(error) {
      const statusCode = error && error.statusCode;
      if (statusCode === 401 && this.view.backToLogin) {
        this.view.backToLogin("\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\u3002");
      } else if ((statusCode === 404 || statusCode === 409 || statusCode === 410) && this.view.backToLobby) {
        this.view.backToLobby(error.message || "\u623F\u95F4\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u521B\u5EFA\u6216\u52A0\u5165\u3002");
      } else {
        this.closeRoom();
        this.online = false;
        if (this.view.backToLobby) this.view.backToLobby(error.message || "\u8FDE\u63A5\u623F\u95F4\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
        else if (this.view.showError) this.view.showError(error.message || "\u8FDE\u63A5\u623F\u95F4\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
      }
    }
    closeRoom() {
      if (!this.room) return;
      const room = this.room;
      this.room = null;
      room.leave();
    }
    // --- Messaging ---
    async sendAction(action, payload = {}) {
      if (!this.roomId) return;
      if (!this.room) return;
      console.info("[wx-mahjong] colyseus action", { action, roomId: this.roomId, clientId: this.clientId });
      try {
        this.room.send(CLIENT_MESSAGES.MahjongAction, Object.assign({ action }, payload));
      } catch (error) {
        console.warn("[wx-mahjong] action failed", action, error);
        this.handleRequestError(error);
      }
    }
    bindRoom(room) {
      console.info("[wx-mahjong] colyseus room joined", { roomId: this.roomId, clientId: this.clientId });
      room.onMessage(SERVER_MESSAGES.MahjongSnapshot, (data) => {
        if (data && data.left) {
          this.closeRoom();
          this.online = false;
          if (this.view.backToLobby) this.view.backToLobby(data.message || "\u5DF2\u9000\u51FA\u623F\u95F4\u3002");
          return;
        }
        this.renderResponseState({ roomId: this.roomId, state: data });
      });
      room.onMessage(SERVER_MESSAGES.MahjongError, (data = {}) => {
        const error = new Error(data.message || "Colyseus request failed.");
        error.code = data.code;
        error.statusCode = mapColyseusErrorStatus(data.code);
        this.handleRequestError(error);
      });
      room.onLeave((code) => {
        console.warn("[wx-mahjong] colyseus room left", { roomId: this.roomId, clientId: this.clientId, code });
        this.room = null;
        this.online = false;
      });
      room.onError((code, message) => {
        console.warn("[wx-mahjong] colyseus room error", { roomId: this.roomId, clientId: this.clientId, code, message });
        const error = new Error(message || "Colyseus room error.");
        error.statusCode = mapColyseusErrorStatus(code);
        this.handleRequestError(error);
      });
    }
    // --- State / error handling ---
    renderResponseState(data) {
      if (data && data.roomId) this.roomId = data.roomId;
      if (data && data.state) {
        data.state.roomId = this.roomId;
        this.view.renderState(data.state);
      }
    }
    handleRequestError(error) {
      const statusCode = error && error.statusCode;
      if (statusCode === 401) {
        this.closeRoom();
        this.online = false;
        if (this.view.backToLogin) {
          this.view.backToLogin("\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\u3002");
          return;
        }
      }
      if (statusCode === 409 && error.code === "account_replaced") {
        this.closeRoom();
        this.online = false;
        if (this.view.backToLobby) {
          this.view.backToLobby(error.message || "\u8D26\u53F7\u5DF2\u5728\u5176\u4ED6\u8BBE\u5907\u8FDB\u5165\u8BE5\u623F\u95F4\u3002");
          return;
        }
      }
      if (statusCode === 404 || statusCode === 410) {
        this.closeRoom();
        this.online = false;
        if (this.view.backToLobby) {
          this.view.backToLobby(error.message || "\u623F\u95F4\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u521B\u5EFA\u6216\u52A0\u5165\u3002");
          return;
        }
      }
      if (this.view.showError) {
        this.view.showError(error.message || "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
        return;
      }
      if (this.view.backToLobby) {
        this.view.backToLobby(error.message || "\u591A\u4EBA\u8FDE\u63A5\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
      }
    }
    handleMissingAuth() {
      this.online = false;
      this.view.renderState(createStatusState("\u8BF7\u5148\u767B\u5F55\u540E\u8FDB\u5165\u623F\u95F4\u3002"));
      if (this.view.backToLogin) this.view.backToLogin("\u8BF7\u5148\u767B\u5F55\u540E\u8FDB\u5165\u623F\u95F4\u3002");
    }
    showDisconnectedError() {
      if (this.view.showError) this.view.showError("\u672A\u8FDE\u63A5\u5230\u591A\u4EBA\u623F\u95F4\u3002");
    }
    // --- Internal ---
    createColyseusClient() {
      return new Client(getServerBaseUrl2());
    }
  };
  function createClientId() {
    return `wx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  function getServerBaseUrl2() {
    const value = globalThis.__WX_MAHJONG_SERVER_URL__ || SERVER_BASE_URL;
    return String(value).replace(/\/+$/, "");
  }
  function mapColyseusErrorStatus(code) {
    if (code === "account_replaced" || code === 4409) return 409;
    if (code === "room_not_found" || code === 4212) return 404;
    if (code === "invalid_room_password" || code === 4403) return 403;
    if (code === 4001 || code === 4401) return 401;
    return 400;
  }
  function createStatusState(message) {
    return {
      phase: "connecting",
      currentPlayer: 0,
      wallCount: 0,
      lastDiscard: null,
      message,
      winner: null,
      bird: null,
      actions: {},
      players: ["\u4F60", "\u4E0B\u5BB6", "\u5BF9\u5BB6", "\u4E0A\u5BB6"].map((name, index) => ({
        index,
        name,
        hand: [],
        drawnTile: null,
        handCount: 0,
        discards: [],
        melds: []
      }))
    };
  }

  // src/mahjong/tiles.js
  var SUITS = [
    { key: "W", name: "\u4E07", color: "#c0392b" },
    { key: "B", name: "\u7B52", color: "#1f7a4d" },
    { key: "T", name: "\u6761", color: "#2563a8" }
  ];
  var ZHONG = "ZH";
  function tileSuit(tile) {
    if (tile === ZHONG) return null;
    return tile[0];
  }
  function tileRank(tile) {
    if (tile === ZHONG) return 0;
    return parseInt(tile.slice(1), 10);
  }
  function tileInfo(tile) {
    if (tile === ZHONG) {
      return { label: "\u4E2D", subLabel: "\u7EA2", color: "#d71920", suit: null, rank: 0 };
    }
    const suit = SUITS.find((item) => item.key === tileSuit(tile)) || SUITS[0];
    const rank = tileRank(tile);
    return {
      label: `${rank}`,
      subLabel: suit.name,
      color: suit.color,
      suit: suit.key,
      rank
    };
  }

  // src/views/board/renderers.js
  var PLAYER_POS = ["bottom", "right", "top", "left"];
  var TILE_SPRITE = {
    src: "images/sprite.png",
    x: 30,
    y: 33,
    width: 94,
    height: 122,
    gapX: 18,
    gapY: 25
  };
  var MINI_TILE_W = 24;
  var MINI_TILE_H = 34;
  var DISCARD_STEP_X = 26;
  var DISCARD_STEP_Y = 36;
  var MELD_TILE_W = 20;
  var MELD_TILE_H = 28;
  var MELD_STEP_X = 22;
  var MELD_GAP = 8;
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function getRemainingSeconds(deadlineAt) {
    return Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1e3));
  }
  function drawRoundRect(ctx, x2, y2, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x2 + radius, y2);
    ctx.lineTo(x2 + width - radius, y2);
    ctx.arcTo(x2 + width, y2, x2 + width, y2 + radius, radius);
    ctx.lineTo(x2 + width, y2 + height - radius);
    ctx.arcTo(x2 + width, y2 + height, x2 + width - radius, y2 + height, radius);
    ctx.lineTo(x2 + radius, y2 + height);
    ctx.arcTo(x2, y2 + height, x2, y2 + height - radius, radius);
    ctx.lineTo(x2, y2 + radius);
    ctx.arcTo(x2, y2, x2 + radius, y2, radius);
    ctx.closePath();
  }
  function drawText(ctx, text, x2, y2, size, color, align = "center", maxWidth = null) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    if (maxWidth) ctx.fillText(text, x2, y2, maxWidth);
    else ctx.fillText(text, x2, y2);
  }
  function getSpriteCell(tile) {
    if (tile === "BACK") return { row: 3, col: 6 };
    if (tile === "ZH") return { row: 3, col: 4 };
    const suit = tile[0];
    const rank = parseInt(tile.slice(1), 10);
    const rowMap = { W: 0, B: 1, T: 2 };
    return { row: rowMap[suit], col: rank - 1 };
  }
  function drawFallbackTile(ctx, tile, x2, y2, width, height, selected) {
    if (tile === "BACK") {
      drawRoundRect(ctx, x2, y2, width, height, 4);
      ctx.fillStyle = "#2f7867";
      ctx.fill();
      ctx.strokeStyle = "#1f574b";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(x2 + width * 0.25, y2 + height * 0.18, width * 0.5, height * 0.64);
      return;
    }
    const info = tileInfo(tile);
    drawRoundRect(ctx, x2, y2, width, height, 5);
    ctx.fillStyle = selected ? "#fff6d7" : "#f7f2e8";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = selected ? "#d39b22" : "#c7bca8";
    ctx.stroke();
    drawText(ctx, info.label, x2 + width / 2, y2 + height * 0.38, Math.max(18, width * 0.52), info.color);
    drawText(ctx, info.subLabel, x2 + width / 2, y2 + height * 0.72, Math.max(10, width * 0.28), info.color);
  }
  function drawTile(ctx, tile, x2, y2, width, height, asset, selected = false, highlighted = false) {
    ctx.save();
    if (highlighted) {
      drawRoundRect(ctx, x2 - 3, y2 - 3, width + 6, height + 6, 7);
      ctx.fillStyle = "rgba(255,210,0,0.32)";
      ctx.fill();
      ctx.strokeStyle = "#f0a800";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    if (!asset || asset.status !== "loaded") {
      drawFallbackTile(ctx, tile, x2, y2, width, height, selected);
    } else {
      const cell = getSpriteCell(tile);
      const sx = TILE_SPRITE.x + cell.col * (TILE_SPRITE.width + TILE_SPRITE.gapX);
      const sy = TILE_SPRITE.y + cell.row * (TILE_SPRITE.height + TILE_SPRITE.gapY);
      ctx.drawImage(asset.image, sx, sy, TILE_SPRITE.width, TILE_SPRITE.height, x2, y2, width, height);
      if (selected) {
        drawRoundRect(ctx, x2, y2, width, height, 5);
        ctx.strokeStyle = "#d39b22";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function drawMiniTile(ctx, tile, x2, y2, asset, highlighted = false) {
    drawTile(ctx, tile, x2, y2, MINI_TILE_W, MINI_TILE_H, asset, false, highlighted);
  }
  function drawMeldTile(ctx, tile, x2, y2, asset) {
    drawTile(ctx, tile, x2, y2, MELD_TILE_W, MELD_TILE_H, asset);
  }
  function getMeldWidth(meld) {
    return Math.max(0, (meld.tiles.length - 1) * MELD_STEP_X + MELD_TILE_W);
  }
  function getMeldRows(melds, maxWidth) {
    const rows = [];
    let row = [];
    let rowWidth = 0;
    melds.forEach((meld) => {
      const meldWidth = getMeldWidth(meld);
      const nextWidth = row.length ? rowWidth + MELD_GAP + meldWidth : meldWidth;
      if (row.length && nextWidth > maxWidth) {
        rows.push({ melds: row, width: rowWidth });
        row = [];
        rowWidth = 0;
      }
      row.push(meld);
      rowWidth = rowWidth ? rowWidth + MELD_GAP + meldWidth : meldWidth;
    });
    if (row.length) rows.push({ melds: row, width: rowWidth });
    return rows;
  }
  function drawMeldRows(ctx, melds, x2, y2, maxWidth, asset, align = "left") {
    const rows = getMeldRows(melds, maxWidth);
    rows.forEach((row, rowIndex) => {
      let tx = align === "right" ? x2 + maxWidth - row.width : x2;
      const ty = y2 + rowIndex * (MELD_TILE_H + 4);
      row.melds.forEach((meld) => {
        meld.tiles.forEach((tile, tileIndex) => {
          drawMeldTile(ctx, tile, tx + tileIndex * MELD_STEP_X, ty, asset);
        });
        tx += getMeldWidth(meld) + MELD_GAP;
      });
    });
  }

  // src/views/board/layout.js
  function getActionItems(state) {
    const actions = [];
    const enabled = state && state.actions ? state.actions : {};
    if (enabled.ready) actions.push({ key: "ready", label: "\u51C6\u5907" });
    if (enabled.leave) actions.push({ key: "leave", label: "\u9000\u51FA" });
    if (enabled.pass) actions.push({ key: "pass", label: "\u8FC7" });
    if (enabled.peng) actions.push({ key: "peng", label: "\u78B0" });
    if (enabled.gang) actions.push({ key: "gang", label: "\u6760" });
    if (enabled.hu) actions.push({ key: "hu", label: "\u80E1" });
    (enabled.gangTiles || []).forEach((tile) => actions.push({ key: `gang:${tile}`, label: "\u6697\u6760", tile }));
    if (state && state.phase === "round-over") actions.push({ key: "restart", label: "\u91CD\u5F00" });
    return actions;
  }
  function getBoardMetrics(width, height) {
    const safeWidth = width || 375;
    const safeHeight = height || 667;
    const isLandscape = safeWidth > safeHeight;
    const edgePad = isLandscape ? 18 : 8;
    const bottomPad = isLandscape ? 10 : 18;
    const gap = isLandscape ? 4 : safeWidth < 360 ? 2 : 3;
    const maxTileW = isLandscape ? 40 : 42;
    const minTileW = isLandscape ? 26 : 18;
    const drawnGap = isLandscape ? 16 : safeWidth < 360 ? 8 : 10;
    const availableHandW = Math.max(260, safeWidth - edgePad * 2);
    const tileW = Math.floor(clamp((availableHandW - drawnGap - gap * 13) / 14, minTileW, maxTileW));
    const tileH = Math.round(tileW * 1.42);
    const handWidth = tileW * 14 + gap * 13 + drawnGap;
    const handX = Math.max(edgePad, (safeWidth - handWidth) / 2);
    const handY = safeHeight - tileH - bottomPad;
    const sideRail = isLandscape ? clamp(safeWidth * 0.12, 80, 124) : clamp(safeWidth * 0.12, 36, 52);
    const tableLeft = sideRail;
    const tableRight = safeWidth - sideRail;
    const tableTop = isLandscape ? 54 : 112;
    const meldY = handY - (isLandscape ? 38 : 42);
    const tableBottom = Math.max(tableTop + 120, meldY - (isLandscape ? 12 : 18));
    const centerX = safeWidth / 2;
    const centerY = (tableTop + tableBottom) / 2;
    return {
      centerX,
      centerY,
      drawnGap,
      gap,
      handX,
      handY,
      isLandscape,
      meldY,
      tableBottom,
      tableLeft,
      tableRight,
      tableTop,
      tileH,
      tileW
    };
  }
  function rowsInRange(top, bottom) {
    return Math.max(1, Math.floor((bottom - top - MINI_TILE_H) / DISCARD_STEP_Y) + 1);
  }
  function getSideMeldMaxWidth(width, metrics) {
    return metrics.isLandscape ? 190 : Math.max(82, Math.min(128, width * 0.34));
  }
  function getDiscardLayout(index, width, metrics, melds = []) {
    const topMeldRows = getMeldRows(melds, width - 24).length;
    const sideMeldRows = getMeldRows(melds, getSideMeldMaxWidth(width, metrics)).length;
    const topStartY = Math.max(
      metrics.tableTop + (metrics.isLandscape ? 64 : 86),
      metrics.tableTop + 6 + topMeldRows * (MELD_TILE_H + 4) + 8
    );
    const topEndY = metrics.centerY - 8;
    const bottomStartY = metrics.centerY + 8;
    const bottomEndY = metrics.tableBottom;
    const verticalStartY = Math.max(topStartY, metrics.tableTop + 40 + sideMeldRows * (MELD_TILE_H + 4) + 8);
    const verticalEndY = metrics.tableBottom;
    if (index === 0 || index === 2) {
      const cols2 = metrics.isLandscape ? 8 : 5;
      const y2 = index === 2 ? topStartY : bottomStartY;
      const rows2 = rowsInRange(y2, index === 2 ? topEndY : bottomEndY);
      return {
        cols: cols2,
        capacity: cols2 * rows2,
        x: metrics.centerX - (cols2 * DISCARD_STEP_X - 2) / 2,
        y: y2
      };
    }
    const cols = metrics.isLandscape ? 5 : 2;
    const rows = Math.min(metrics.isLandscape ? 4 : 8, rowsInRange(verticalStartY, verticalEndY));
    const gridW = cols * DISCARD_STEP_X - 2;
    const gridH = rows * DISCARD_STEP_Y - 2;
    return {
      cols,
      capacity: cols * rows,
      x: index === 1 ? width - metrics.tableLeft - gridW : metrics.tableLeft,
      y: clamp(metrics.centerY - gridH / 2, verticalStartY, verticalEndY - MINI_TILE_H)
    };
  }
  function getHandHitRects(state, width, height) {
    const { drawnGap, gap, tileW, tileH, handX, handY } = getBoardMetrics(width, height);
    const player = state && state.players && state.players[0] ? state.players[0] : null;
    const hand = player ? player.hand : [];
    const drawnIndex = player && player.drawnTile ? hand.length - 1 : -1;
    return hand.map((tile, index) => ({
      index,
      x: handX + index * (tileW + gap) + (index === drawnIndex ? drawnGap : 0),
      y: handY,
      width: tileW,
      height: tileH
    }));
  }
  function getActionLayout(state, width, height) {
    const { handY, isLandscape, meldY, tableTop } = getBoardMetrics(width, height);
    const actions = getActionItems(state);
    if (!actions.length) return [];
    const safeWidth = width || 375;
    const gap = isLandscape ? 8 : safeWidth < 360 ? 5 : 7;
    const maxButtonW = isLandscape ? 64 : 70;
    const buttonH = isLandscape ? 34 : 36;
    const availableW = Math.max(180, safeWidth - 24);
    const buttonW = Math.floor(
      clamp((availableW - Math.max(0, actions.length - 1) * gap) / actions.length, 40, maxButtonW)
    );
    const totalW = actions.length * buttonW + Math.max(0, actions.length - 1) * gap;
    const startX = Math.max(12, (safeWidth - totalW) / 2);
    const preferredY = Math.min(handY - buttonH - 10, meldY - buttonH - 8);
    const y2 = Math.max(tableTop + 8, preferredY);
    return actions.map(
      (action, index) => Object.assign(action, {
        x: startX + index * (buttonW + gap),
        y: y2,
        width: buttonW,
        height: buttonH
      })
    );
  }

  // src/views/board/board-graphic.js
  var BoardGraphic = class extends Graphic {
    constructor(assetManager) {
      super();
      this.assets = assetManager;
      this.state = null;
      this.spriteAsset = null;
    }
    setState(state) {
      this.state = state;
      this.invalidatePaint();
    }
    draw(ctx) {
      const x2 = 0;
      const y2 = 0;
      const width = this.width;
      const height = this.height;
      const state = this.state;
      const metrics = getBoardMetrics(width, height);
      const spriteAsset = this.getSpriteAsset();
      ctx.fillStyle = "#173b32";
      ctx.fillRect(x2, y2, width, height);
      ctx.fillStyle = "#205447";
      ctx.fillRect(
        x2 + metrics.tableLeft,
        y2 + metrics.tableTop,
        metrics.tableRight - metrics.tableLeft,
        metrics.tableBottom - metrics.tableTop
      );
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.fillRect(x2, y2 + metrics.handY - 8, width, height - metrics.handY + 8);
      if (!state) return;
      this.drawHeader(ctx, state, x2, y2, width, metrics, spriteAsset);
      this.drawMelds(ctx, state, x2, y2, width, height, metrics, spriteAsset);
      this.drawPlayers(ctx, state, x2, y2, width, height, metrics);
      this.drawDiscards(ctx, state, x2, y2, width, height, metrics, spriteAsset);
      this.drawStatus(ctx, state, x2, y2, width, metrics, spriteAsset);
      this.drawHand(ctx, state, width, height, spriteAsset);
    }
    // --- Private helpers ---
    getSpriteAsset() {
      if (!this.spriteAsset && this.assets) {
        this.spriteAsset = this.assets.image(TILE_SPRITE.src);
        this.spriteAsset.promise.then(() => this.invalidatePaint()).catch(() => this.invalidatePaint());
      }
      return this.spriteAsset;
    }
    drawHeader(ctx, state, x2, y2, width, metrics, spriteAsset) {
      const titleY = metrics.isLandscape ? 20 : 22;
      drawText(ctx, "\u7EA2\u4E2D\u9EBB\u5C06", x2 + 18, y2 + titleY, 18, "#f9f2dc", "left");
      if (state.roomId) {
        drawText(ctx, `\u623F\u95F4 ${state.roomId}`, x2 + width / 2, y2 + titleY, 13, "#dce8de");
      }
      drawText(ctx, `\u724C\u5899 ${state.wallCount}`, x2 + width - 18, y2 + titleY, 14, "#dce8de", "right");
      if (state.bird) {
        const birdY = metrics.isLandscape ? 34 : 58;
        drawText(ctx, "\u9E1F", x2 + width - 54, y2 + birdY + 16, 12, "#f9f2dc");
        drawMiniTile(ctx, state.bird, x2 + width - 42, y2 + birdY, spriteAsset);
      }
    }
    drawStatus(ctx, state, x2, y2, width, metrics, spriteAsset) {
      const actions = getActionLayout(state, width, this.height);
      const panelW = metrics.isLandscape ? 210 : Math.min(190, width - 24);
      const panelX = x2 + width - panelW - 12;
      const preferredY = actions.length ? actions[0].y - 62 : metrics.handY - 82;
      const panelY = y2 + clamp(preferredY, metrics.tableTop + 8, metrics.handY - 58);
      const textX = panelX + panelW;
      if (state.lastDiscard) {
        const name = state.players[state.lastDiscard.from].name;
        drawText(ctx, `\u5F53\u524D\u5F03\u724C\uFF1A${name}`, textX - MINI_TILE_W - 8, panelY + 18, 12, "#dce8de", "right", panelW - 40);
        drawMiniTile(ctx, state.lastDiscard.tile, textX - MINI_TILE_W, panelY, spriteAsset, true);
      } else {
        drawText(ctx, "\u5F53\u524D\u5F03\u724C\uFF1A\u65E0", textX, panelY + 16, 12, "#dce8de", "right", panelW);
      }
      drawText(ctx, state.message, textX, panelY + 50, 13, "#fff4c5", "right", panelW);
    }
    drawPlayers(ctx, state, x2, y2, width, height, metrics) {
      state.players.forEach((player, index) => {
        const pos = PLAYER_POS[index];
        const active = state.currentPlayer === index && state.phase !== "round-over";
        const color = active ? "#ffd86b" : "#dce8de";
        const countdownText = active && state.turnDeadlineAt ? ` ${getRemainingSeconds(state.turnDeadlineAt)}s` : "";
        const readyText = state.roomStatus === "waiting" || state.roomStatus === "settling" ? ` ${player.isReady ? "\u5DF2\u51C6\u5907" : "\u672A\u51C6\u5907"}` : "";
        const label = `${player.name}${readyText}${countdownText}`;
        if (pos === "bottom") {
          drawText(ctx, label, x2 + Math.max(18, metrics.handX - 18), y2 + metrics.handY + metrics.tileH / 2, 13, color);
        } else if (pos === "top") {
          drawText(ctx, `${label} ${player.handCount}\u5F20`, x2 + width / 2, y2 + metrics.tableTop - 16, 13, color);
        } else if (pos === "left") {
          const nameX = metrics.isLandscape ? metrics.tableLeft - 50 : 20;
          drawText(ctx, `${label} ${player.handCount}\u5F20`, x2 + nameX, y2 + metrics.centerY - 76, 13, color);
        } else if (pos === "right") {
          const nameX = metrics.isLandscape ? metrics.tableRight + 50 : width - 20;
          drawText(ctx, `${label} ${player.handCount}\u5F20`, x2 + nameX, y2 + metrics.centerY - 76, 13, color);
        }
      });
    }
    drawDiscards(ctx, state, x2, y2, width, height, metrics, spriteAsset) {
      state.players.forEach((player, index) => {
        const layout = getDiscardLayout(index, width, metrics, player.melds);
        const tiles = player.discards.slice(-layout.capacity);
        const isLastFrom = state.lastDiscard && state.lastDiscard.from === index;
        const lastTileIdx = tiles.length - 1;
        tiles.forEach((tile, tileIndex) => {
          const tx = x2 + layout.x + tileIndex % layout.cols * DISCARD_STEP_X;
          const ty = y2 + layout.y + Math.floor(tileIndex / layout.cols) * DISCARD_STEP_Y;
          drawMiniTile(ctx, tile, tx, ty, spriteAsset, isLastFrom && tileIndex === lastTileIdx);
        });
      });
    }
    drawMelds(ctx, state, x2, y2, width, height, metrics, spriteAsset) {
      const topMaxWidth = width - 24;
      const sideMaxWidth = getSideMeldMaxWidth(width, metrics);
      drawMeldRows(ctx, state.players[2].melds, x2 + 12, y2 + metrics.tableTop + 6, topMaxWidth, spriteAsset);
      drawMeldRows(ctx, state.players[3].melds, x2 + 12, y2 + metrics.tableTop + 40, sideMaxWidth, spriteAsset);
      drawMeldRows(
        ctx,
        state.players[1].melds,
        x2 + width - 12 - sideMaxWidth,
        y2 + metrics.tableTop + 40,
        sideMaxWidth,
        spriteAsset,
        "right"
      );
      let mx = metrics.isLandscape ? 18 : 12;
      const actionLayout = getActionLayout(state, width, height);
      const my = actionLayout.length ? Math.max(metrics.tableTop + 8, actionLayout[0].y - 42) : metrics.meldY;
      state.players[0].melds.forEach((meld) => {
        meld.tiles.forEach((tile) => {
          drawMiniTile(ctx, tile, mx, my, spriteAsset);
          mx += 26;
        });
        mx += 8;
      });
    }
    drawHand(ctx, state, width, height, spriteAsset) {
      const rects = getHandHitRects(state, width, height);
      const canDiscard = state.actions.discard;
      rects.forEach((rect) => {
        const tile = state.players[0].hand[rect.index];
        drawTile(ctx, tile, rect.x, rect.y, rect.width, rect.height, spriteAsset, canDiscard && tile !== "ZH");
      });
    }
  };

  // src/views/main-view.js
  var MainView = class extends Container {
    constructor(app2, authSession = null, roomOptions = {}) {
      super();
      this.app = app2;
      this.state = null;
      this.authSession = authSession;
      this.controls = [];
      this.controlSizeKey = "";
      this.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.board = this.addChild(new BoardGraphic(app2.assets));
      this.board.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.controller = new GameController(this, authSession, roomOptions);
    }
    renderState(state) {
      this.state = state;
      this.board.setState(state);
      this.rebuildControls();
    }
    update() {
      if (!this.state) return;
      const sizeKey = `${this.width}x${this.height}`;
      if (this.width && this.height && this.controlSizeKey !== sizeKey) {
        this.rebuildControls();
      }
      if (this.state.turnDeadlineAt) {
        this.board.invalidatePaint();
      }
    }
    rebuildControls() {
      if (!this.state) return;
      this.controls.forEach((control) => control.remove());
      this.controls = [];
      const width = this.width || 375;
      const height = this.height || 667;
      this.controlSizeKey = `${width}x${height}`;
      getHandHitRects(this.state, width, height).forEach((rect) => {
        const hit = this.addChild(new Container());
        hit.touchEnabled = true;
        hit.setLayout(
          anchor({
            anchor: "top-left",
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          })
        );
        hit.on("tap", () => {
          this.controller.discard(rect.index);
        });
        this.controls.push(hit);
      });
      getActionLayout(this.state, width, height).forEach((action) => {
        const button = this.addChild(
          new Button(action.label, {
            background: { fillStyle: "#2f7df6", radius: 6 },
            label: { fillStyle: "#fff", fontSize: 15 }
          })
        );
        button.setLayout(
          anchor({
            anchor: "top-left",
            x: action.x,
            y: action.y,
            width: action.width,
            height: action.height
          })
        );
        button.on("tap", () => this.handleAction(action));
        this.controls.push(button);
      });
      this.invalidatePaint();
    }
    handleAction(action) {
      if (action.key === "ready") this.controller.ready();
      else if (action.key === "leave") this.controller.leave();
      else if (action.key === "pass") this.controller.pass();
      else if (action.key === "peng") this.controller.peng();
      else if (action.key === "gang") this.controller.gang();
      else if (action.key === "hu") this.controller.hu();
      else if (action.key === "restart") this.controller.restart();
      else if (action.key.indexOf("gang:") === 0) this.controller.gang(action.tile);
    }
    backToLobby(message = "") {
      this.app.setRoot(new LobbyView(this.app, this.authSession, { message }));
    }
    backToLogin(message = "") {
      const loginView2 = new LoginView(this.app, {
        message,
        onLogin: (authSession) => {
          this.app.setRoot(new LobbyView(this.app, authSession));
        }
      });
      this.app.setRoot(loginView2);
      loginView2.startLogin(true);
    }
    showError(message) {
      if (!this.state) return;
      this.state = Object.assign({}, this.state, { message });
      this.board.setState(this.state);
      this.rebuildControls();
    }
  };

  // src/views/lobby-view.js
  var LobbyView = class _LobbyView extends Container {
    constructor(app2, authSession, options = {}) {
      super();
      this.app = app2;
      this.authSession = authSession;
      this.status = options.message || "\u8BF7\u9009\u62E9\u623F\u95F4\u64CD\u4F5C";
      this.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.background = this.addChild(new Shape({ fillStyle: "#173b32" }));
      this.background.setLayout(anchor({ anchor: "top-left", width: "100%", height: "100%" }));
      this.title = this.addChild(
        new Text("\u7EA2\u4E2D\u9EBB\u5C06", {
          fillStyle: "#f9f2dc",
          fontSize: 28,
          textAlign: "center"
        })
      );
      this.title.setLayout(anchor({ anchor: "top", y: 108, width: 240, height: 44 }));
      this.statusText = this.addChild(
        new Text(this.status, {
          fillStyle: "#dce8de",
          fontSize: 14,
          lineHeight: 22,
          maxLines: 3,
          textAlign: "center"
        })
      );
      this.statusText.setLayout(anchor({ anchor: "top", y: 168, width: 280, height: 70 }));
      this.createButton = this.addChild(
        new Button("\u521B\u5EFA\u623F\u95F4", {
          background: { fillStyle: "#2f7df6", radius: 6 },
          label: { fillStyle: "#fff", fontSize: 16 }
        })
      );
      this.createButton.setLayout(anchor({ anchor: "top", y: 260, width: 170, height: 44 }));
      this.createButton.on("tap", () => this.handleCreate());
      this.joinButton = this.addChild(
        new Button("\u52A0\u5165\u623F\u95F4", {
          background: { fillStyle: "#f2a33a", radius: 6 },
          label: { fillStyle: "#173b32", fontSize: 16 }
        })
      );
      this.joinButton.setLayout(anchor({ anchor: "top", y: 320, width: 170, height: 44 }));
      this.joinButton.on("tap", () => this.handleJoin());
      this.reloginButton = this.addChild(
        new Button("\u91CD\u65B0\u767B\u5F55", {
          background: { fillStyle: "#385f55", radius: 6 },
          label: { fillStyle: "#f9f2dc", fontSize: 15 }
        })
      );
      this.reloginButton.setLayout(anchor({ anchor: "top", y: 382, width: 170, height: 40 }));
      this.reloginButton.on("tap", () => this.handleRelogin());
    }
    async handleJoin() {
      const { roomId, password } = await requestJoinInfo();
      if (!roomId) return;
      if (!/^[a-zA-Z0-9_-]{6,64}$/.test(roomId)) {
        this.setStatus("\u8BF7\u8F93\u5165\u6709\u6548\u623F\u95F4 ID");
        return;
      }
      this.enterRoom({ roomId, password });
    }
    async handleCreate() {
      const config = { timeoutSeconds: 30, password: "" };
      this.enterRoom(Object.assign({ createRoom: true }, config));
    }
    enterRoom(options) {
      this.app.setRoot(new MainView(this.app, this.authSession, options));
    }
    handleRelogin() {
      clearCachedAuthSession(this.app);
      const loginView2 = new LoginView(this.app, {
        message: "\u5DF2\u6E05\u9664\u767B\u5F55\u7F13\u5B58\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
        onLogin: (authSession) => {
          this.app.setRoot(new _LobbyView(this.app, authSession));
        }
      });
      this.app.setRoot(loginView2);
      loginView2.startLogin(true);
    }
    setStatus(text) {
      this.status = text;
      this.statusText.text = text;
      this.invalidatePaint();
    }
  };

  // src/index.js
  var WebSocket_send = globalThis.WebSocket.prototype.send;
  globalThis.WebSocket.prototype.send = function(data) {
    console.log("send");
    if (data instanceof Uint8Array) {
      WebSocket_send.call(this, data.slice().buffer);
    } else if (Array.isArray(data)) {
      WebSocket_send.call(this, new Uint8Array(data).buffer);
    } else {
      WebSocket_send.call(this, data);
    }
  };
  var app = createWeChatApp({ fps: 60 });
  var loginView = new LoginView(app, {
    onLogin(authSession) {
      app.setRoot(new LobbyView(app, authSession));
    }
  });
  app.start(loginView);
  loginView.startLogin();
})();
