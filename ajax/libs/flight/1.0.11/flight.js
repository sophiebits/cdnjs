(function(context){var factories={},loaded={};var isArray=Array.isArray||function(obj){return obj.constructor==Array};var map=Array.map||function(arr,fn,scope){for(var i=0,len=arr.length,result=[];i<len;i++){result.push(fn.call(scope,arr[i]))}return result};function define(){var args=Array.prototype.slice.call(arguments),dependencies=[],id,factory;if(typeof args[0]=="string"){id=args.shift()}if(isArray(args[0])){dependencies=args.shift()}factory=args.shift();factories[id]=[dependencies,factory]}function require(id){function resolve(dep){var relativeParts=id.split("/"),depParts=dep.split("/"),relative=false;relativeParts.pop();while(depParts[0]==".."&&relativeParts.length){relativeParts.pop();depParts.shift();relative=true}if(depParts[0]=="."){depParts.shift();relative=true}if(relative){depParts=relativeParts.concat(depParts)}return depParts.join("/")}var unresolved,factory,dependencies;if(typeof loaded[id]=="undefined"){unresolved=factories[id];if(unresolved){dependencies=unresolved[0];factory=unresolved[1];loaded[id]=factory.apply(undefined,map(dependencies,function(id){return require(resolve(id))}))}}return loaded[id]};define("lib/utils",[],function(){var a=[],b=100,c={isDomObj:function(a){return!!a.nodeType||a===window},toArray:function(b,c){return a.slice.call(b,c)},merge:function(){var a=arguments.length,b=0,c=new Array(a+1);for(;b<a;b++)c[b+1]=arguments[b];return a===0?{}:(c[0]={},c[c.length-1]===!0&&(c.pop(),c.unshift(!0)),$.extend.apply(undefined,c))},push:function(a,b,c){return a&&Object.keys(b||{}).forEach(function(d){if(a[d]&&c)throw Error("utils.push attempted to overwrite '"+d+"' while running in protected mode");typeof a[d]=="object"&&typeof b[d]=="object"?this.push(a[d],b[d]):a[d]=b[d]},this),a},isEnumerable:function(a,b){return Object.keys(a).indexOf(b)>-1},compose:function(){var a=arguments;return function(){var b=arguments;for(var c=a.length-1;c>=0;c--)b=[a[c].apply(this,b)];return b[0]}},uniqueArray:function(a){var b={},c=[];for(var d=0,e=a.length;d<e;++d){if(b.hasOwnProperty(a[d]))continue;c.push(a[d]),b[a[d]]=1}return c},debounce:function(a,c,d){typeof c!="number"&&(c=b);var e,f;return function(){var b=this,g=arguments,h=function(){e=null,d||(f=a.apply(b,g))},i=d&&!e;return clearTimeout(e),e=setTimeout(h,c),i&&(f=a.apply(b,g)),f}},throttle:function(a,c){typeof c!="number"&&(c=b);var d,e,f,g,h,i,j=this.debounce(function(){h=g=!1},c);return function(){d=this,e=arguments;var b=function(){f=null,h&&(i=a.apply(d,e)),j()};return f||(f=setTimeout(b,c)),g?h=!0:(g=!0,i=a.apply(d,e)),j(),i}},countThen:function(a,b){return function(){if(!--a)return b.apply(this,arguments)}},delegate:function(a){return function(b,c){var d=$(b.target),e;Object.keys(a).forEach(function(f){if((e=d.closest(f)).length)return c=c||{},c.el=e[0],a[f].apply(this,[b,c])},this)}}};return c})
define("lib/registry",["./utils"],function(a){function b(a,b){var c,d,e,f=b.length;return typeof b[f-1]=="function"&&(f-=1,e=b[f]),typeof b[f-1]=="object"&&(f-=1),f==2?(c=b[0],d=b[1]):(c=a.node,d=b[0]),{element:c,type:d,callback:e}}function c(a,b){return a.element==b.element&&a.type==b.type&&(b.callback==null||a.callback==b.callback)}function d(){function d(b){this.component=b,this.attachedTo=[],this.instances={},this.addInstance=function(a){var b=new e(a);return this.instances[a.identity]=b,this.attachedTo.push(a.node),b},this.removeInstance=function(b){delete this.instances[b.identity];var c=this.attachedTo.indexOf(b.node);c>-1&&this.attachedTo.splice(c,1),Object.keys(this.instances).length||a.removeComponentInfo(this)},this.isAttachedTo=function(a){return this.attachedTo.indexOf(a)>-1}}function e(b){this.instance=b,this.events=[],this.addBind=function(b){this.events.push(b),a.events.push(b)},this.removeBind=function(a){for(var b=0,d;d=this.events[b];b++)c(d,a)&&this.events.splice(b,1)}}var a=this;(this.reset=function(){this.components=[],this.allInstances={},this.events=[]}).call(this),this.addInstance=function(a){var b=this.findComponentInfo(a);b||(b=new d(a.constructor),this.components.push(b));var c=b.addInstance(a);return this.allInstances[a.identity]=c,b},this.removeInstance=function(a){var b,c=this.findInstanceInfo(a),d=this.findComponentInfo(a);d&&d.removeInstance(a),delete this.allInstances[a.identity]},this.removeComponentInfo=function(a){var b=this.components.indexOf(a);b>-1&&this.components.splice(b,1)},this.findComponentInfo=function(a){var b=a.attachTo?a:a.constructor;for(var c=0,d;d=this.components[c];c++)if(d.component===b)return d;return null},this.findInstanceInfo=function(a){return this.allInstances[a.identity]||null},this.findInstanceInfoByNode=function(a){var b=[];return Object.keys(this.allInstances).forEach(function(c){var d=this.allInstances[c];d.instance.node===a&&b.push(d)},this),b},this.on=function(c){var d=a.findInstanceInfo(this),e,f=arguments.length,g=1,h=new Array(f-1);for(;g<f;g++)h[g-1]=arguments[g];if(d){e=c.apply(null,h),e&&(h[h.length-1]=e);var i=b(this,h);d.addBind(i)}},this.off=function(d,e,f){var g=b(this,arguments),h=a.findInstanceInfo(this);h&&h.removeBind(g);for(var i=0,j;j=a.events[i];i++)c(j,g)&&a.events.splice(i,1)},a.trigger=new Function,this.teardown=function(){a.removeInstance(this)},this.withRegistration=function(){this.before("initialize",function(){a.addInstance(this)}),this.around("on",a.on),this.after("off",a.off),window.DEBUG&&DEBUG.enabled&&this.after("trigger",a.trigger),this.after("teardown",{obj:a,fnName:"teardown"})}}return new d})
define("tools/debug/debug",["../../lib/registry","../../lib/utils"],function(a,b){function d(a,b,c){var c=c||{},e=c.obj||window,g=c.path||(e==window?"window":""),h=Object.keys(e);h.forEach(function(c){(f[a]||a)(b,e,c)&&console.log([g,".",c].join(""),"->",["(",typeof e[c],")"].join(""),e[c]),Object.prototype.toString.call(e[c])=="[object Object]"&&e[c]!=e&&g.split(".").indexOf(c)==-1&&d(a,b,{obj:e[c],path:[g,c].join(".")})})}function e(a,b,c,e){!b||typeof c==b?d(a,c,e):console.error([c,"must be",b].join(" "))}function g(a,b){e("name","string",a,b)}function h(a,b){e("nameContains","string",a,b)}function i(a,b){e("type","function",a,b)}function j(a,b){e("value",null,a,b)}function k(a,b){e("valueCoerced",null,a,b)}function l(a,b){d(a,null,b)}function p(){var a=[].slice.call(arguments);c.eventNames.length||(c.eventNames=m),c.actions=a.length?a:m,t()}function q(){var a=[].slice.call(arguments);c.actions.length||(c.actions=m),c.eventNames=a.length?a:m,t()}function r(){c.actions=[],c.eventNames=[],t()}function s(){c.actions=m,c.eventNames=m,t()}function t(){window.localStorage&&(localStorage.setItem("logFilter_eventNames",c.eventNames),localStorage.setItem("logFilter_actions",c.actions))}function u(){var a={eventNames:window.localStorage&&localStorage.getItem("logFilter_eventNames")||n,actions:window.localStorage&&localStorage.getItem("logFilter_actions")||o};return Object.keys(a).forEach(function(b){var c=a[b];typeof c=="string"&&c!==m&&(a[b]=c.split(","))}),a}var c,f={name:function(a,b,c){return a==c},nameContains:function(a,b,c){return c.indexOf(a)>-1},type:function(a,b,c){return b[c]instanceof a},value:function(a,b,c){return b[c]===a},valueCoerced:function(a,b,c){return b[c]==a}},m="all",n=[],o=[],c=u();return{enable:function(a){this.enabled=!!a,a&&window.console&&(console.info("Booting in DEBUG mode"),console.info("You can configure event logging with DEBUG.events.logAll()/logNone()/logByName()/logByAction()")),window.DEBUG=this},find:{byName:g,byNameContains:h,byType:i,byValue:j,byValueCoerced:k,custom:l},events:{logFilter:c,logByAction:p,logByName:q,logAll:s,logNone:r}}})
define("lib/compose",["./utils","../tools/debug/debug"],function(a,b){function f(a,b){if(!c)return;var e=Object.create(null);Object.keys(a).forEach(function(c){if(d.indexOf(c)<0){var f=Object.getOwnPropertyDescriptor(a,c);f.writable=b,e[c]=f}}),Object.defineProperties(a,e)}function g(a,b,d){var e;if(!c||!a.hasOwnProperty(b)){d.call(a);return}e=Object.getOwnPropertyDescriptor(a,b).writable,Object.defineProperty(a,b,{writable:!0}),d.call(a),Object.defineProperty(a,b,{writable:e})}function h(a,b){a.mixedIn=a.hasOwnProperty("mixedIn")?a.mixedIn:[],b.forEach(function(b){a.mixedIn.indexOf(b)==-1&&(f(a,!1),b.call(a),a.mixedIn.push(b))}),f(a,!0)}var c=b.enabled&&!a.isEnumerable(Object,"getOwnPropertyDescriptor"),d=["mixedIn"];if(c)try{Object.getOwnPropertyDescriptor(Object,"keys")}catch(e){c=!1}return{mixin:h,unlockProperty:g}})
define("lib/advice",["./utils","./compose"],function(a,b){var c={around:function(a,b){return function(){var d=0,e=arguments.length,f=new Array(e+1);f[0]=a.bind(this);for(;d<e;d++)f[d+1]=arguments[d];return b.apply(this,f)}},before:function(a,b){var c=typeof b=="function"?b:b.obj[b.fnName];return function(){return c.apply(this,arguments),a.apply(this,arguments)}},after:function(a,b){var c=typeof b=="function"?b:b.obj[b.fnName];return function(){var d=(a.unbound||a).apply(this,arguments);return c.apply(this,arguments),d}},withAdvice:function(){["before","after","around"].forEach(function(a){this[a]=function(d,e){b.unlockProperty(this,d,function(){return typeof this[d]=="function"?this[d]=c[a](this[d],e):this[d]=e})}},this)}};return c})
define("lib/logger",["./compose","./utils"],function(a,b){function d(a){var b=a.tagName?a.tagName.toLowerCase():a.toString(),c=a.className?"."+a.className:"",d=b+c;return a.tagName?["'","'"].join(d):d}function e(a,b,e){var f,g,h,i,j,k,l,m;typeof e[e.length-1]=="function"&&(h=e.pop(),h=h.unbound||h),typeof e[e.length-1]=="object"&&e.pop(),e.length==2?(g=e[0],f=e[1]):(g=b.$node[0],f=e[0]),window.DEBUG&&window.DEBUG.enabled&&(j=DEBUG.events.logFilter,l=j.actions=="all"||j.actions.indexOf(a)>-1,k=function(a){return a.test?a:new RegExp("^"+a.replace(/\*/g,".*")+"$")},m=j.eventNames=="all"||j.eventNames.some(function(a){return k(a).test(f)}),l&&m&&console.info(c[a],a,"["+f+"]",d(g),b.constructor.describe.split(" ").slice(0,3).join(" ")))}function f(){this.before("trigger",function(){e("trigger",this,b.toArray(arguments))}),this.before("on",function(){e("on",this,b.toArray(arguments))}),this.before("off",function(a){e("off",this,b.toArray(arguments))})}var c={on:"<-",trigger:"->",off:"x "};return f})
define("lib/component",["./advice","./utils","./compose","./registry","./logger","../tools/debug/debug"],function(a,b,c,d,e,f){function i(a){a.events.slice().forEach(function(a){var b=[a.type];a.element&&b.unshift(a.element),typeof a.callback=="function"&&b.push(a.callback),this.off.apply(this,b)},a.instance)}function j(){i(d.findInstanceInfo(this))}function k(){var a=d.findComponentInfo(this);a&&Object.keys(a.instances).forEach(function(b){var c=a.instances[b];c.instance.teardown()})}function l(a,b){try{window.postMessage(b,"*")}catch(c){throw console.log("unserializable data for event",a,":",b),new Error(["The event",a,"on component",this.toString(),"was triggered with non-serializable data"].join(" "))}}function m(){this.trigger=function(){var a,b,c,d,e,g=arguments.length-1,h=arguments[g];return typeof h!="string"&&(!h||!h.defaultBehavior)&&(g--,c=h),g==1?(a=$(arguments[0]),d=arguments[1]):(a=this.$node,d=arguments[0]),d.defaultBehavior&&(e=d.defaultBehavior,d=$.Event(d.type)),b=d.type||d,f.enabled&&window.postMessage&&l.call(this,b,c),typeof this.attr.eventData=="object"&&(c=$.extend(!0,{},this.attr.eventData,c)),a.trigger(d||b,c),e&&!d.isDefaultPrevented()&&(this[e]||e).call(this),a},this.on=function(){var a,c,d,e,f=arguments.length-1,g=arguments[f];typeof g=="object"?e=b.delegate(this.resolveDelegateRules(g)):e=g,f==2?(a=$(arguments[0]),c=arguments[1]):(a=this.$node,c=arguments[0]);if(typeof e!="function"&&typeof e!="object")throw new Error("Unable to bind to '"+c+"' because the given callback is not a function or an object");return d=e.bind(this),d.target=e,e.guid&&(d.guid=e.guid),a.on(c,d),e.guid=d.guid,d},this.off=function(){var a,b,c,d=arguments.length-1;return typeof arguments[d]=="function"&&(c=arguments[d],d-=1),d==1?(a=$(arguments[0]),b=arguments[1]):(a=this.$node,b=arguments[0]),a.off(b,c)},this.resolveDelegateRules=function(a){var b={};return Object.keys(a).forEach(function(c){if(!c in this.attr)throw new Error('Component "'+this.toString()+'" wants to listen on "'+c+'" but no such attribute was defined.');b[this.attr[c]]=a[c]},this),b},this.defaultAttrs=function(a){b.push(this.defaults,a,!0)||(this.defaults=a)},this.select=function(a){return this.$node.find(this.attr[a])},this.initialize=$.noop,this.teardown=j}function n(a){var c=arguments.length,e=new Array(c-1);for(var f=1;f<c;f++)e[f-1]=arguments[f];if(!a)throw new Error("Component needs to be attachTo'd a jQuery object, native node or selector string");var g=b.merge.apply(b,e);$(a).each(function(a,b){var c=b.jQuery?b[0]:b,e=d.findComponentInfo(this);if(e&&e.isAttachedTo(c))return;new this(b,g)}.bind(this))}function o(){function l(a,b){b=b||{},this.identity=h++;if(!a)throw new Error("Component needs a node");a.jquery?(this.node=a[0],this.$node=a):(this.node=a,this.$node=$(a)),this.toString=l.toString,f.enabled&&(this.describe=this.toString());var c=Object.create(b);for(var d in this.defaults)b.hasOwnProperty(d)||(c[d]=this.defaults[d]);this.attr=c,Object.keys(this.defaults||{}).forEach(function(a){if(this.defaults[a]===null&&this.attr[a]===null)throw new Error('Required attribute "'+a+'" not specified in attachTo for component "'+this.toString()+'".')},this),this.initialize.call(this,b)}var b=arguments.length,i=new Array(b+3);for(var j=0;j<b;j++)i[j]=arguments[j];return l.toString=function(){var a=i.map(function(a){if(a.name==null){var b=a.toString().match(g);return b&&b[1]?b[1]:""}return a.name!="withBaseComponent"?a.name:""}).filter(Boolean).join(", ");return a},f.enabled&&(l.describe=l.toString()),l.attachTo=n,l.teardownAll=k,f.enabled&&i.unshift(e),i.unshift(m,a.withAdvice,d.withRegistration),c.mixin(l.prototype,i),l}var g=/function (.*?)\s?\(/,h=0;return o.teardownAll=function(){d.components.slice().forEach(function(a){a.component.teardownAll()}),d.reset()},o})
define("lib/index",["./advice","./component","./compose","./logger","./registry","./utils"],function(a,b,c,d,e,f){return{advice:a,component:b,compose:c,logger:d,registry:e,utils:f}});context.flight=require("lib/index")})(this);