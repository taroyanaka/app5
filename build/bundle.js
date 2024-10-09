var app=function(t){"use strict";function e(){}function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function l(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode&&t.parentNode.removeChild(t)}function a(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function d(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function p(){return f(" ")}function h(){return f("")}function g(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function m(t){return function(e){return e.preventDefault(),t.call(this,e)}}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function v(t){return""===t?null:+t}function _(t,e){e=""+e,t.data!==e&&(t.data=e)}function x(t,e){t.value=null==e?"":e}function b(t,e,n,r){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}let w;function $(t){w=t}function C(t){(function(){if(!w)throw new Error("Function called outside component initialization");return w})().$$.on_mount.push(t)}const S=[],N=[];let E=[];const O=[],k=Promise.resolve();let q=!1;function A(t){E.push(t)}const J=new Set;let j=0;function T(){if(0!==j)return;const t=w;do{try{for(;j<S.length;){const t=S[j];j++,$(t),P(t.$$)}}catch(t){throw S.length=0,j=0,t}for($(null),S.length=0,j=0;N.length;)N.pop()();for(let t=0;t<E.length;t+=1){const e=E[t];J.has(e)||(J.add(e),e())}E.length=0}while(S.length);for(;O.length;)O.pop()();q=!1,J.clear(),$(t)}function P(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}const R=new Set;function I(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];E.forEach((r=>-1===t.indexOf(r)?e.push(r):n.push(r))),n.forEach((t=>t())),E=e}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function L(t,e){-1===t.$$.dirty[0]&&(S.push(t),q||(q=!0,k.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function D(t,s,i,c,a,d,f,p=[-1]){const h=w;$(t);const g=t.$$={fragment:null,ctx:[],props:d,update:e,not_equal:a,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(h?h.$$.context:[])),callbacks:r(),dirty:p,skip_bound:!1,root:s.target||h.$$.root};f&&f(g.root);let m=!1;if(g.ctx=i?i(t,s.props||{},((e,n,...r)=>{const o=r.length?r[0]:n;return g.ctx&&a(g.ctx[e],g.ctx[e]=o)&&(!g.skip_bound&&g.bound[e]&&g.bound[e](o),m&&L(t,e)),n})):[],g.update(),m=!0,o(g.before_update),g.fragment=!!c&&c(g.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);g.fragment&&g.fragment.l(t),t.forEach(u)}else g.fragment&&g.fragment.c();s.intro&&((y=t.$$.fragment)&&y.i&&(R.delete(y),y.i(v))),function(t,e,r,s){const{fragment:i,after_update:c}=t.$$;i&&i.m(e,r),s||A((()=>{const e=t.$$.on_mount.map(n).filter(l);t.$$.on_destroy?t.$$.on_destroy.push(...e):o(e),t.$$.on_mount=[]})),c.forEach(A)}(t,s.target,s.anchor,s.customElement),T()}var y,v;$(h)}class M{$destroy(){I(this,1),this.$destroy=e}$on(t,n){if(!l(n))return e;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(n),()=>{const t=r.indexOf(n);-1!==t&&r.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Q(t,e,n){const r=t.slice();return r[46]=e[n],r}function G(t,e,n){const r=t.slice();return r[49]=e[n],r}function W(t,e,n){const r=t.slice();return r[52]=e[n],r}function z(t,e,n){const r=t.slice();return r[46]=e[n],r}function B(t,e,n){const r=t.slice();return r[57]=e[n],r}function K(t,e,n){const r=t.slice();return r[49]=e[n],r}function F(t,e,n){const r=t.slice();return r[52]=e[n],r}function U(t,e,n){const r=t.slice();return r[46]=e[n],r}function H(t,e,n){const r=t.slice();return r[57]=e[n],r}function V(t,e,n){const r=t.slice();return r[49]=e[n],r}function Y(t,e,n){const r=t.slice();return r[52]=e[n],r}function X(t){let n,r,o;return{c(){n=d("button"),n.textContent="Login"},m(e,l){c(e,n,l),r||(o=g(n,"click",t[17]),r=!0)},p:e,d(t){t&&u(n),r=!1,o()}}}function Z(t){let n,r,o;return{c(){n=d("button"),n.textContent="Logout"},m(e,l){c(e,n,l),r||(o=g(n,"click",t[18]),r=!0)},p:e,d(t){t&&u(n),r=!1,o()}}}function tt(t){let e,n,r,l;return{c(){e=d("button"),n=f(t[0]),y(e,"id","error_message"),b(e,"background","none"),b(e,"border","none"),b(e,"padding","0"),b(e,"margin","0"),b(e,"color","inherit"),b(e,"font","inherit"),b(e,"cursor","pointer")},m(o,s){c(o,e,s),i(e,n),r||(l=[g(e,"click",t[27]),g(e,"keydown",t[28])],r=!0)},p(t,e){1&e[0]&&_(n,t[0])},d(t){t&&u(e),r=!1,o(l)}}}function et(t){let n,r,o;return{c(){n=d("button"),n.textContent="Create Record"},m(e,l){c(e,n,l),r||(o=g(n,"click",t[19]),r=!0)},p:e,d(t){t&&u(n),r=!1,o()}}}function nt(t){let e,n,r=t[52]+"";return{c(){e=d("span"),n=f(r)},m(t,r){c(t,e,r),i(e,n)},p(t,e){32&e[0]&&r!==(r=t[52]+"")&&_(n,r)},d(t){t&&u(e)}}}function rt(t){let e,n=t[46].answers,r=[];for(let e=0;e<n.length;e+=1)r[e]=lt(H(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=h()},m(t,n){for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,n);c(t,e,n)},p(t,o){if(32&o[0]){let l;for(n=t[46].answers,l=0;l<n.length;l+=1){const s=H(t,n,l);r[l]?r[l].p(s,o):(r[l]=lt(s),r[l].c(),r[l].m(e.parentNode,e))}for(;l<r.length;l+=1)r[l].d(1);r.length=n.length}},d(t){a(r,t),t&&u(e)}}}function ot(t){let e,n,r=t[49]+"";return{c(){e=d("span"),n=f(r)},m(t,r){c(t,e,r),i(e,n)},p(t,e){32&e[0]&&r!==(r=t[49]+"")&&_(n,r)},d(t){t&&u(e)}}}function lt(t){let e,n=t[57],r=[];for(let e=0;e<n.length;e+=1)r[e]=ot(V(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=h()},m(t,n){for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,n);c(t,e,n)},p(t,o){if(32&o[0]){let l;for(n=t[57],l=0;l<n.length;l+=1){const s=V(t,n,l);r[l]?r[l].p(s,o):(r[l]=ot(s),r[l].c(),r[l].m(e.parentNode,e))}for(;l<r.length;l+=1)r[l].d(1);r.length=n.length}},d(t){a(r,t),t&&u(e)}}}function st(t){let e,n,r;function o(){return t[29](t[46])}return{c(){e=d("button"),e.textContent="set_data_to_create_response_mode"},m(t,l){c(t,e,l),n||(r=g(e,"click",o),n=!0)},p(e,n){t=e},d(t){t&&u(e),n=!1,r()}}}function it(t){let e,n,r,o,l,s,h,g,m,v,x,b,w,$,C,S,N,E,O,k,q,A,J,j,T,P,R=t[46].id+"",I=t[46].title+"",L=t[46].description+"",D=t[46].user_id+"",M=t[46].price+"",Q=JSON.parse(t[46].questions),G=[];for(let e=0;e<Q.length;e+=1)G[e]=nt(Y(t,Q,e));let W=t[46].answers&&rt(t),z=t[3]!==t[46].user_id&&st(t);return{c(){e=d("li"),n=d("div"),r=d("h3"),o=f("id: "),l=f(R),s=p(),h=d("h3"),g=f("title: "),m=f(I),v=f(","),x=p(),b=d("h4"),w=f("description: "),$=f(L),C=p(),S=d("h5"),N=f("user_id: "),E=f(D),O=f("\n                                questions ->\n                                ");for(let t=0;t<G.length;t+=1)G[t].c();k=f("\n                                answers ->\n                                "),W&&W.c(),q=p(),A=d("p"),J=f("price: "),j=f(M),T=p(),z&&z.c(),P=p(),y(r,"class","svelte-yxc2ri"),y(h,"class","svelte-yxc2ri"),y(b,"class","svelte-yxc2ri"),y(S,"class","svelte-yxc2ri"),y(n,"class","in_list svelte-yxc2ri")},m(t,u){c(t,e,u),i(e,n),i(n,r),i(r,o),i(r,l),i(n,s),i(n,h),i(h,g),i(h,m),i(h,v),i(n,x),i(n,b),i(b,w),i(b,$),i(n,C),i(n,S),i(S,N),i(S,E),i(e,O);for(let t=0;t<G.length;t+=1)G[t]&&G[t].m(e,null);i(e,k),W&&W.m(e,null),i(e,q),i(e,A),i(A,J),i(A,j),i(e,T),z&&z.m(e,null),i(e,P)},p(t,n){if(32&n[0]&&R!==(R=t[46].id+"")&&_(l,R),32&n[0]&&I!==(I=t[46].title+"")&&_(m,I),32&n[0]&&L!==(L=t[46].description+"")&&_($,L),32&n[0]&&D!==(D=t[46].user_id+"")&&_(E,D),32&n[0]){let r;for(Q=JSON.parse(t[46].questions),r=0;r<Q.length;r+=1){const o=Y(t,Q,r);G[r]?G[r].p(o,n):(G[r]=nt(o),G[r].c(),G[r].m(e,k))}for(;r<G.length;r+=1)G[r].d(1);G.length=Q.length}t[46].answers?W?W.p(t,n):(W=rt(t),W.c(),W.m(e,q)):W&&(W.d(1),W=null),32&n[0]&&M!==(M=t[46].price+"")&&_(j,M),t[3]!==t[46].user_id?z?z.p(t,n):(z=st(t),z.c(),z.m(e,P)):z&&(z.d(1),z=null)},d(t){t&&u(e),a(G,t),W&&W.d(),z&&z.d()}}}function ct(t){let e,n,r=t[52]+"";return{c(){e=d("span"),n=f(r)},m(t,r){c(t,e,r),i(e,n)},p(t,e){64&e[0]&&r!==(r=t[52]+"")&&_(n,r)},d(t){t&&u(e)}}}function ut(t){let e,n=t[46].answers,r=[];for(let e=0;e<n.length;e+=1)r[e]=dt(B(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=h()},m(t,n){for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,n);c(t,e,n)},p(t,o){if(64&o[0]){let l;for(n=t[46].answers,l=0;l<n.length;l+=1){const s=B(t,n,l);r[l]?r[l].p(s,o):(r[l]=dt(s),r[l].c(),r[l].m(e.parentNode,e))}for(;l<r.length;l+=1)r[l].d(1);r.length=n.length}},d(t){a(r,t),t&&u(e)}}}function at(t){let e,n,r=t[49]+"";return{c(){e=d("span"),n=f(r)},m(t,r){c(t,e,r),i(e,n)},p(t,e){64&e[0]&&r!==(r=t[49]+"")&&_(n,r)},d(t){t&&u(e)}}}function dt(t){let e,n=t[57],r=[];for(let e=0;e<n.length;e+=1)r[e]=at(K(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=h()},m(t,n){for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,n);c(t,e,n)},p(t,o){if(64&o[0]){let l;for(n=t[57],l=0;l<n.length;l+=1){const s=K(t,n,l);r[l]?r[l].p(s,o):(r[l]=at(s),r[l].c(),r[l].m(e.parentNode,e))}for(;l<r.length;l+=1)r[l].d(1);r.length=n.length}},d(t){a(r,t),t&&u(e)}}}function ft(t){let e,n,r,o,l,s,h,g,m,v,x,b,w,$,C,S,N,E,O,k,q,A,J,j,T,P=t[46].id+"",R=t[46].title+"",I=t[46].description+"",L=t[46].user_id+"",D=t[46].price+"",M=JSON.parse(t[46].questions),Q=[];for(let e=0;e<M.length;e+=1)Q[e]=ct(F(t,M,e));let G=t[46].answers&&ut(t);return{c(){e=d("li"),n=d("div"),r=d("h3"),o=f("id: "),l=f(P),s=p(),h=d("h3"),g=f("title: "),m=f(R),v=f(","),x=p(),b=d("h4"),w=f("description: "),$=f(I),C=p(),S=d("h5"),N=f("user_id: "),E=f(L),O=f("\n                                questions ->\n                                ");for(let t=0;t<Q.length;t+=1)Q[t].c();k=f("\n                                answers ->\n                                "),G&&G.c(),q=p(),A=d("p"),J=f("price: "),j=f(D),T=p(),y(r,"class","svelte-yxc2ri"),y(h,"class","svelte-yxc2ri"),y(b,"class","svelte-yxc2ri"),y(S,"class","svelte-yxc2ri"),y(n,"class","in_list svelte-yxc2ri")},m(t,u){c(t,e,u),i(e,n),i(n,r),i(r,o),i(r,l),i(n,s),i(n,h),i(h,g),i(h,m),i(h,v),i(n,x),i(n,b),i(b,w),i(b,$),i(n,C),i(n,S),i(S,N),i(S,E),i(e,O);for(let t=0;t<Q.length;t+=1)Q[t]&&Q[t].m(e,null);i(e,k),G&&G.m(e,null),i(e,q),i(e,A),i(A,J),i(A,j),i(e,T)},p(t,n){if(64&n[0]&&P!==(P=t[46].id+"")&&_(l,P),64&n[0]&&R!==(R=t[46].title+"")&&_(m,R),64&n[0]&&I!==(I=t[46].description+"")&&_($,I),64&n[0]&&L!==(L=t[46].user_id+"")&&_(E,L),64&n[0]){let r;for(M=JSON.parse(t[46].questions),r=0;r<M.length;r+=1){const o=F(t,M,r);Q[r]?Q[r].p(o,n):(Q[r]=ct(o),Q[r].c(),Q[r].m(e,k))}for(;r<Q.length;r+=1)Q[r].d(1);Q.length=M.length}t[46].answers?G?G.p(t,n):(G=ut(t),G.c(),G.m(e,q)):G&&(G.d(1),G=null),64&n[0]&&D!==(D=t[46].price+"")&&_(j,D)},d(t){t&&u(e),a(Q,t),G&&G.d()}}}function pt(t){let e,n,r=t[52]+"";return{c(){e=d("span"),n=f(r)},m(t,r){c(t,e,r),i(e,n)},p(t,e){128&e[0]&&r!==(r=t[52]+"")&&_(n,r)},d(t){t&&u(e)}}}function ht(t){let e,n=JSON.parse(t[46].answers),r=[];for(let e=0;e<n.length;e+=1)r[e]=gt(G(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=h()},m(t,n){for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,n);c(t,e,n)},p(t,o){if(128&o[0]){let l;for(n=JSON.parse(t[46].answers),l=0;l<n.length;l+=1){const s=G(t,n,l);r[l]?r[l].p(s,o):(r[l]=gt(s),r[l].c(),r[l].m(e.parentNode,e))}for(;l<r.length;l+=1)r[l].d(1);r.length=n.length}},d(t){a(r,t),t&&u(e)}}}function gt(t){let e,n,r=t[49]+"";return{c(){e=d("span"),n=f(r)},m(t,r){c(t,e,r),i(e,n)},p(t,e){128&e[0]&&r!==(r=t[49]+"")&&_(n,r)},d(t){t&&u(e)}}}function mt(t){let e,n,r,o,l,s,h,g,m,v,x,b,w,$,C,S,N,E,O,k,q,A,J,j,T,P=t[46].id+"",R=t[46].title+"",I=t[46].description+"",L=t[46].user_id+"",D=t[46].price+"",M=JSON.parse(t[46].questions),Q=[];for(let e=0;e<M.length;e+=1)Q[e]=pt(W(t,M,e));let G=t[46].answers&&ht(t);return{c(){e=d("li"),n=d("div"),r=d("h3"),o=f("id: "),l=f(P),s=p(),h=d("h3"),g=f("title: "),m=f(R),v=f(","),x=p(),b=d("h4"),w=f("description: "),$=f(I),C=p(),S=d("h5"),N=f("user_id: "),E=f(L),O=f("\n                                questions ->\n                                ");for(let t=0;t<Q.length;t+=1)Q[t].c();k=f("\n                                answers ->\n                                "),G&&G.c(),q=p(),A=d("p"),J=f("price: "),j=f(D),T=p(),y(r,"class","svelte-yxc2ri"),y(h,"class","svelte-yxc2ri"),y(b,"class","svelte-yxc2ri"),y(S,"class","svelte-yxc2ri"),y(n,"class","in_list svelte-yxc2ri")},m(t,u){c(t,e,u),i(e,n),i(n,r),i(r,o),i(r,l),i(n,s),i(n,h),i(h,g),i(h,m),i(h,v),i(n,x),i(n,b),i(b,w),i(b,$),i(n,C),i(n,S),i(S,N),i(S,E),i(e,O);for(let t=0;t<Q.length;t+=1)Q[t]&&Q[t].m(e,null);i(e,k),G&&G.m(e,null),i(e,q),i(e,A),i(A,J),i(A,j),i(e,T)},p(t,n){if(128&n[0]&&P!==(P=t[46].id+"")&&_(l,P),128&n[0]&&R!==(R=t[46].title+"")&&_(m,R),128&n[0]&&I!==(I=t[46].description+"")&&_($,I),128&n[0]&&L!==(L=t[46].user_id+"")&&_(E,L),128&n[0]){let r;for(M=JSON.parse(t[46].questions),r=0;r<M.length;r+=1){const o=W(t,M,r);Q[r]?Q[r].p(o,n):(Q[r]=pt(o),Q[r].c(),Q[r].m(e,k))}for(;r<Q.length;r+=1)Q[r].d(1);Q.length=M.length}t[46].answers?G?G.p(t,n):(G=ht(t),G.c(),G.m(e,q)):G&&(G.d(1),G=null),128&n[0]&&D!==(D=t[46].price+"")&&_(j,D)},d(t){t&&u(e),a(Q,t),G&&G.d()}}}function yt(t){let n,r,o;return{c(){n=d("button"),n.textContent="Change Title"},m(e,l){c(e,n,l),r||(o=g(n,"click",t[22]),r=!0)},p:e,d(t){t&&u(n),r=!1,o()}}}function vt(t){let e,n,r,l,s;return{c(){e=d("input"),n=p(),r=d("button"),r.textContent="Update",y(e,"type","text")},m(o,i){c(o,e,i),x(e,t[8]),c(o,n,i),c(o,r,i),l||(s=[g(e,"input",t[30]),g(r,"click",t[23])],l=!0)},p(t,n){256&n[0]&&e.value!==t[8]&&x(e,t[8])},d(t){t&&u(e),t&&u(n),t&&u(r),l=!1,o(s)}}}function _t(t){let n,r,l,s,h,b,w,$,C,S,N,E,O,k,q,A,J,j,T,P,R,I,L,D,M,G,W,B,K,F,H,V,Y,nt,rt,ot,lt,st,ct,ut,at,dt,pt,ht,gt,_t,xt,wt,$t,Ct,St,Nt,Et,Ot,kt,qt,At,Jt,jt,Tt,Pt,Rt,It,Lt,Dt,Mt,Qt,Gt,Wt,zt,Bt,Kt,Ft,Ut,Ht,Vt,Yt,Xt,Zt,te,ee,ne,re,oe,le,se;function ie(t,e){return t[1]?Z:X}let ce=ie(t),ue=ce(t),ae=t[0]&&tt(t),de=t[1]&&et(t),fe=t[5],pe=[];for(let e=0;e<fe.length;e+=1)pe[e]=it(U(t,fe,e));let he=t[6],ge=[];for(let e=0;e<he.length;e+=1)ge[e]=ft(z(t,he,e));let me=t[7],ye=[];for(let e=0;e<me.length;e+=1)ye[e]=mt(Q(t,me,e));function ve(t,e){return t[9]?vt:yt}let _e=ve(t),xe=_e(t);return{c(){n=d("div"),r=d("div"),l=d("h1"),l.textContent=`${bt}`,s=p(),ue.c(),h=p(),b=d("div"),w=d("div"),$=d("div"),ae&&ae.c(),C=p(),S=d("p"),N=f(t[4]),E=p(),O=d("p"),k=f(t[8]),q=p(),de&&de.c(),A=p(),J=d("p"),j=f("uid: "),T=f(t[2]),P=p(),R=d("p"),I=f("your_id: "),L=f(t[3]),D=p(),M=d("div"),G=d("ul"),W=d("div"),B=d("h2"),B.textContent="web_data_surveys",K=p();for(let t=0;t<pe.length;t+=1)pe[t].c();F=p(),H=d("div"),V=d("h2"),V.textContent="web_data_mySurveysAndResponses",Y=p();for(let t=0;t<ge.length;t+=1)ge[t].c();nt=p(),rt=d("div"),ot=d("h2"),ot.textContent="web_data_myResponses",lt=p();for(let t=0;t<ye.length;t+=1)ye[t].c();st=p(),ct=d("div"),ut=d("button"),ut.textContent="Sample Data",at=p(),xe.c(),dt=p(),pt=d("button"),pt.textContent="Test Text List",ht=p(),gt=d("div"),_t=d("h3"),_t.textContent="Create Survey",xt=p(),wt=d("form"),$t=d("div"),Ct=d("label"),Ct.textContent="Title:",St=p(),Nt=d("input"),Et=p(),Ot=d("div"),kt=d("label"),kt.textContent="Description:",qt=p(),At=d("textarea"),Jt=p(),jt=d("div"),Tt=d("label"),Tt.textContent="Price:",Pt=p(),Rt=d("input"),It=p(),Lt=d("div"),Dt=d("label"),Dt.textContent="Questions (one per line):",Mt=p(),Qt=d("textarea"),Gt=p(),Wt=d("button"),Wt.textContent="Create Survey",zt=p(),Bt=d("div"),Kt=d("h3"),Kt.textContent="Create Response",Ft=p(),Ut=d("form"),Ht=d("div"),Vt=d("span"),Yt=f("Survey ID: "),Xt=f(t[15]),Zt=p(),te=d("label"),te.textContent="Answers (one per line):",ee=p(),ne=d("textarea"),re=p(),oe=d("button"),oe.textContent="Create Response",y(r,"class","header svelte-yxc2ri"),y($,"class","console"),y(M,"class","list"),y(w,"class","left-column server_side svelte-yxc2ri"),y(Ct,"for","survey_title"),y(Nt,"type","text"),y(Nt,"id","survey_title"),Nt.required=!0,y(kt,"for","survey_description"),y(At,"id","survey_description"),y(At,"class","svelte-yxc2ri"),y(Tt,"for","survey_price"),y(Rt,"type","number"),y(Rt,"id","survey_price"),y(Rt,"min","100"),y(Rt,"max","10000"),y(Rt,"step","100"),Rt.required=!0,y(Dt,"for","questions"),y(Qt,"id","questions"),y(Qt,"class","svelte-yxc2ri"),y(Wt,"type","submit"),y(gt,"class","create_survey_mode"),y(te,"for","answers"),y(ne,"id","answers"),ne.required=!0,y(ne,"class","svelte-yxc2ri"),y(oe,"type","submit"),y(Bt,"class","create_response_mode"),y(ct,"class","right-column svelte-yxc2ri"),y(b,"class","content svelte-yxc2ri"),y(n,"class","container svelte-yxc2ri")},m(e,o){c(e,n,o),i(n,r),i(r,l),i(r,s),ue.m(r,null),i(n,h),i(n,b),i(b,w),i(w,$),ae&&ae.m($,null),i($,C),i($,S),i(S,N),i($,E),i($,O),i(O,k),i($,q),de&&de.m($,null),i($,A),i($,J),i(J,j),i(J,T),i($,P),i($,R),i(R,I),i(R,L),i(w,D),i(w,M),i(M,G),i(G,W),i(W,B),i(W,K);for(let t=0;t<pe.length;t+=1)pe[t]&&pe[t].m(W,null);i(G,F),i(G,H),i(H,V),i(H,Y);for(let t=0;t<ge.length;t+=1)ge[t]&&ge[t].m(H,null);i(G,nt),i(G,rt),i(rt,ot),i(rt,lt);for(let t=0;t<ye.length;t+=1)ye[t]&&ye[t].m(rt,null);i(b,st),i(b,ct),i(ct,ut),i(ct,at),xe.m(ct,null),i(ct,dt),i(ct,pt),i(ct,ht),i(ct,gt),i(gt,_t),i(gt,xt),i(gt,wt),i(wt,$t),i($t,Ct),i($t,St),i($t,Nt),x(Nt,t[10]),i(wt,Et),i(wt,Ot),i(Ot,kt),i(Ot,qt),i(Ot,At),x(At,t[11]),i(wt,Jt),i(wt,jt),i(jt,Tt),i(jt,Pt),i(jt,Rt),x(Rt,t[13]),i(wt,It),i(wt,Lt),i(Lt,Dt),i(Lt,Mt),i(Lt,Qt),x(Qt,t[12]),i(wt,Gt),i(wt,Wt),i(ct,zt),i(ct,Bt),i(Bt,Kt),i(Bt,Ft),i(Bt,Ut),i(Ut,Ht),i(Ht,Vt),i(Vt,Yt),i(Vt,Xt),i(Ht,Zt),i(Ht,te),i(Ht,ee),i(Ht,ne),x(ne,t[14]),i(Ut,re),i(Ut,oe),le||(se=[g(ut,"click",t[16]),g(pt,"click",t[31]),g(Nt,"input",t[32]),g(At,"input",t[33]),g(Rt,"input",t[34]),g(Qt,"input",t[35]),g(wt,"submit",m(t[19])),g(ne,"input",t[36]),g(Ut,"submit",m(t[37]))],le=!0)},p(t,e){if(ce===(ce=ie(t))&&ue?ue.p(t,e):(ue.d(1),ue=ce(t),ue&&(ue.c(),ue.m(r,null))),t[0]?ae?ae.p(t,e):(ae=tt(t),ae.c(),ae.m($,C)):ae&&(ae.d(1),ae=null),16&e[0]&&_(N,t[4]),256&e[0]&&_(k,t[8]),t[1]?de?de.p(t,e):(de=et(t),de.c(),de.m($,A)):de&&(de.d(1),de=null),4&e[0]&&_(T,t[2]),8&e[0]&&_(L,t[3]),1048616&e[0]){let n;for(fe=t[5],n=0;n<fe.length;n+=1){const r=U(t,fe,n);pe[n]?pe[n].p(r,e):(pe[n]=it(r),pe[n].c(),pe[n].m(W,null))}for(;n<pe.length;n+=1)pe[n].d(1);pe.length=fe.length}if(64&e[0]){let n;for(he=t[6],n=0;n<he.length;n+=1){const r=z(t,he,n);ge[n]?ge[n].p(r,e):(ge[n]=ft(r),ge[n].c(),ge[n].m(H,null))}for(;n<ge.length;n+=1)ge[n].d(1);ge.length=he.length}if(128&e[0]){let n;for(me=t[7],n=0;n<me.length;n+=1){const r=Q(t,me,n);ye[n]?ye[n].p(r,e):(ye[n]=mt(r),ye[n].c(),ye[n].m(rt,null))}for(;n<ye.length;n+=1)ye[n].d(1);ye.length=me.length}_e===(_e=ve(t))&&xe?xe.p(t,e):(xe.d(1),xe=_e(t),xe&&(xe.c(),xe.m(ct,dt))),1024&e[0]&&Nt.value!==t[10]&&x(Nt,t[10]),2048&e[0]&&x(At,t[11]),8192&e[0]&&v(Rt.value)!==t[13]&&x(Rt,t[13]),4096&e[0]&&x(Qt,t[12]),32768&e[0]&&_(Xt,t[15]),16384&e[0]&&x(ne,t[14])},i:e,o:e,d(t){t&&u(n),ue.d(),ae&&ae.d(),de&&de.d(),a(pe,t),a(ge,t),a(ye,t),xe.d(),le=!1,o(se)}}}const xt="http://localhost:8000",bt="app5!!";function wt(e,n,r){t.initializeApp({apiKey:"AIzaSyBcOlIDP2KWbJuKM0WeMHNp-WvjTVfLt9Y",authDomain:"p2auth-ea50a.firebaseapp.com",projectId:"p2auth-ea50a",storageBucket:"p2auth-ea50a.appspot.com",messagingSenderId:"796225429484",appId:"1:796225429484:web:ece56ef2fc0be28cd6eac9"});const o=new t.auth.GoogleAuthProvider;let l="",s=null,i="user1",c=null,u="Not logged in",a=[],d=[],f=[],p="GAFAM",h=!1,g=1,m=[],y=[],_="",x="",b="",w=100,$="abcdef";let S=null;async function N(){try{console.log("fetch_data");const t=await fetch(xt+"/app5/surveys_and_responses/read_all",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:i})}),e=await t.json();r(3,c=e.id||null),r(5,a=e.surveys),r(6,d=e.mySurveysAndResponses),r(7,f=e.myResponses)}catch(t){console.error("Error fetching data:",t)}}const E=t=>{try{if(console.log("id:",t),!t)throw new Error("ID is empty.");if(!a)throw new Error("web_data_surveys not found.");const e=a.find((e=>e.id===t));if(!e)throw new Error("Survey not found.");if(!e.questions)throw new Error("Questions not found.");if("string"!=typeof e.questions)throw new Error("Questions not a string.");let n;try{n=JSON.parse(e.questions)}catch(t){throw new Error("Questions not valid JSON.")}if(!Array.isArray(n))throw new Error("Questions not an array.");r(14,$=JSON.parse(e.questions).join("\n")),r(15,S=t)}catch(t){console.error("Error setting data to create response mode:",t)}};async function O(t){try{const e=await fetch(xt+"/app5/responses/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:i,survey_id:t,answers:$})}),n=await e.json();console.log("Response created:",n)}catch(t){console.error("Error creating response:",t)}}C((()=>{N()}));return e.$$.update=()=>{117440512&e.$$.dirty[0]&&(r(25,m="".split("\n").filter((t=>""!==t.trim()))),m.length>100?r(0,l="URLリストは100行までです。"):r(0,l=""),r(26,y=Array.from({length:m.length},((t,e)=>e+1))),y.length>0&&r(24,g=Math.max(g,y[y.length-1])))},[l,s,i,c,u,a,d,f,p,h,_,x,b,w,$,S,()=>r(10,[_,x,b,w,$,S]=["サンプルアンケート","サンプルアンケートの説明","質問1\n質問2\n質問3",100,"回答1\n回答2\n回答3",1],_,r(11,x),r(12,b),r(13,w),r(14,$),r(15,S)),function(){t.auth().signInWithPopup(o).then((t=>{r(1,s=t.user),r(4,u=`Logged in as: ${s.displayName}`)})).catch((t=>{console.error("Error during Google login:",t),alert("Google login failed. "+t.message)}))},function(){t.auth().signOut().then((()=>{r(1,s=null),r(4,u="Not logged in")})).catch((t=>{console.error("Error during sign-out:",t),alert("Sign out failed. "+t.message)}))},async function(){try{const t=await fetch(xt+"/app5/surveys/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:i,survey_title:_,survey_description:x,survey_price:100,questions:b.split("\n")})}),e=await t.json();console.log("Record created:",e),N()}catch(t){console.error("Error creating record:",t)}},E,O,function(){r(9,h=!h)},function(){r(9,h=!1)},g,m,y,()=>r(0,l=""),t=>{"Enter"!==t.key&&" "!==t.key||r(0,l="")},t=>E(t.id),function(){p=this.value,r(8,p)},()=>r(11,x=test_app5_text),function(){_=this.value,r(10,_)},function(){x=this.value,r(11,x)},function(){w=v(this.value),r(13,w)},function(){b=this.value,r(12,b)},function(){$=this.value,r(14,$)},()=>O(S)]}return new class extends M{constructor(t){super(),D(this,t,wt,_t,s,{},null,[-1,-1,-1])}}({target:document.body})}(firebase);
//# sourceMappingURL=bundle.js.map
