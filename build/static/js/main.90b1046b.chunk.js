(this["webpackJsonpreact-material-ui"]=this["webpackJsonpreact-material-ui"]||[]).push([[0],{86:function(e,t,n){},87:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(24),i=n.n(a),c=n(45),s=n(20),d="MASSDK_CREATE",u="MAP_CREATE",l="MASSROUTE_CREATE",b=n(23);function h(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return{type:l,data:e}}var j,p,x=n(130),g=n(8),m=n(131),O=n(127),f=n(128),v=n(132),k=n(19),w={fontSize:14,marginRight:.5,width:"19%",maxHeight:"21px",minHeight:"21px",backgroundColor:"#E6F5D6",color:"black",textTransform:"unset !important"},S={textAlign:"center",color:"#5B1080"},C={position:"absolute",top:"0%",left:"auto",right:"-6%",height:"21px",width:"6%",color:"black"},R={position:"absolute",marginTop:"15vh",marginLeft:"24vh",width:340,bgcolor:"background.paper",border:"3px solid #000",borderColor:"primary.main",borderRadius:2,boxShadow:24,p:1.5},y={position:"absolute",marginTop:"15vh",marginLeft:"24vh",width:250,bgcolor:"background.paper",border:"3px solid #000",borderColor:"primary.main",borderRadius:2,boxShadow:24,p:2},M={position:"absolute",top:"0%",left:"auto",right:"-9%",maxHeight:"21px",minHeight:"21px",width:"6%",color:"black"},W={fontSize:17,maxHeight:"21px",minHeight:"21px",backgroundColor:"#E6F5D6",color:"black",marginRight:1,marginBottom:2,textTransform:"unset !important",textAlign:"center"},A={width:"230px",maxHeight:"4px",minHeight:"4px",bgcolor:"#FAFAFA",boxShadow:24,textAlign:"center",p:1.5},E={fontSize:13.3,color:"black",maxHeight:"27px",minHeight:"27px",maxWidth:"62px",minWidth:"62px",backgroundColor:"#FFDB4D",textTransform:"unset !important"},F={width:"319px",height:"30px",marginTop:"9vh",marginLeft:"48px"},I={"& > :not(style)":{marginTop:"-9px",marginLeft:"-12px",width:"255px"}},D=n(1),P=function(e){var t=o.useState(!0),n=Object(g.a)(t,2),r=n[0],a=n[1],i=function(){e.setOpen(!1),a(!1)},c=0,s="";if(e.activeRoute){c=Math.round(e.activeRoute.properties.get("distance").value);var d=e.activeRoute.properties.get("duration").text;s=d.substring(0,d.length-1)+" ("+Math.round(e.activeRoute.properties.get("duration").value)+" \u0441\u0435\u043a)",console.log("1111",e.activeRoute.properties.get("duration"))}return Object(D.jsx)(f.a,{open:r,onClose:i,hideBackdrop:!0,children:Object(D.jsxs)(m.a,{sx:R,children:[Object(D.jsx)(O.a,{sx:C,onClick:i,children:Object(D.jsx)("b",{children:"\u2716"})}),Object(D.jsxs)(m.a,{children:[Object(D.jsx)("b",{children:"\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0430 \u0441\u0432\u044f\u0437\u0438:"}),Object(D.jsx)("br",{}),e.name1,Object(D.jsx)("br",{}),Object(D.jsx)("b",{children:"\u041a\u043e\u043d\u0435\u0447\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0430 \u0441\u0432\u044f\u0437\u0438:"}),Object(D.jsx)("br",{}),e.name2,Object(D.jsx)("br",{}),Object(D.jsx)("b",{children:"\u0414\u043b\u0438\u043d\u0430 \u0441\u0432\u044f\u0437\u0438: "}),c," \u043c",Object(D.jsx)("br",{}),Object(D.jsx)("b",{children:"\u0412\u0440\u0435\u043c\u044f \u043f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u044f: "}),s,Object(D.jsx)("br",{})]}),e.activeRoute&&e.activeRoute.properties.get("blocked")&&Object(D.jsx)(m.a,{children:"\u0418\u043c\u0435\u044e\u0442\u0441\u044f \u0443\u0447\u0430\u0441\u0442\u043a\u0438 \u0441 \u043f\u0435\u0440\u0435\u043a\u0440\u044b\u0442\u044b\u043c\u0438 \u0434\u043e\u0440\u043e\u0433\u0430\u043c\u0438"})]})})},B=n(126),T=function(e){var t=Object(b.c)((function(e){return e.massdkReducer.massdk})),n=o.useState(!0),r=Object(g.a)(n,2),a=r[0],i=r[1],c=o.useState(t[e.iPoint].nameCoordinates),s=Object(g.a)(c,2),d=s[0],u=s[1],l=function(){t[e.iPoint].nameCoordinates=d,i(!1),e.setOpen(!1)};return Object(D.jsx)(m.a,{children:Object(D.jsx)(f.a,{open:a,onClose:l,hideBackdrop:!0,children:Object(D.jsxs)(x.a,{item:!0,container:!0,sx:F,children:[Object(D.jsx)(x.a,{item:!0,xs:9.5,sx:{border:0},children:Object(D.jsx)(m.a,{sx:A,children:Object(D.jsx)(m.a,{component:"form",sx:I,noValidate:!0,autoComplete:"off",children:Object(D.jsx)(B.a,{size:"small",onKeyPress:function(e){"Enter"===e.key&&e.preventDefault()},inputProps:{style:{fontSize:13.3}},value:d,onChange:function(e){u(e.target.value)},variant:"standard"})})})}),Object(D.jsx)(x.a,{item:!0,xs:!0,sx:{border:0},children:Object(D.jsx)(m.a,{children:Object(D.jsx)(O.a,{sx:E,variant:"contained",onClick:l,children:"\u0412\u0432\u043e\u0434"})})})]})})})},H=function(e){var t=o.useState(!0),n=Object(g.a)(t,2),r=n[0],a=n[1];return Object(D.jsx)(f.a,{open:r,onClose:function(e,t){"backdropClick"!==t&&a(!1)},hideBackdrop:!0,children:Object(D.jsxs)(m.a,{sx:R,children:[Object(D.jsx)(O.a,{sx:C,onClick:function(){e.setOpen(!1),a(!1)},children:Object(D.jsx)("b",{children:"\u2716"})}),Object(D.jsx)(v.a,{variant:"h6",sx:{textAlign:"center",color:"red"},children:e.sErr})]})})},z=function(e){var t=o.useState(!0),n=Object(g.a)(t,2),r=n[0],a=n[1],i=function(){e.setOpen(!1),a(!1)};return Object(D.jsx)(f.a,{open:r,onClose:i,hideBackdrop:!0,children:Object(D.jsxs)(m.a,{sx:R,children:[Object(D.jsx)(O.a,{sx:C,onClick:i,children:Object(D.jsx)("b",{children:"\u2716"})}),Object(D.jsxs)(m.a,{sx:{textAlign:"center"},children:[Object(D.jsx)("br",{}),Object(D.jsx)("br",{}),Object(D.jsx)("b",{children:"\u0417\u0434\u0435\u0441\u044c \u0431\u0443\u0434\u0435\u0442 \u043f\u0440\u0438\u0432\u044f\u0437\u043a\u0430 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f"}),Object(D.jsx)("br",{})," ",Object(D.jsx)("br",{}),Object(D.jsx)("br",{})]})]})})},L=function(e){return e.split(",").map(Number)},_=function(e){return String(e[0])+","+String(e[1])},J=function(e,t,n,o){var r="";return e===t&&(r="\u041d\u0430\u0447\u0430\u043b\u043e"),e===n&&(r="\u041a\u043e\u043d\u0435\u0446"),{hintContent:o[e].nameCoordinates,iconContent:r}},X=function(e,t,n,o){var r="islands#violetStretchyIcon";return o[e].newCoordinates>0&&(r="islands#darkOrangeStretchyIcon"),e===t&&(r="islands#redStretchyIcon"),e===n&&(r="islands#darkBlueStretchyIcon"),{preset:r}},Y=function(e,t){return{referencePoints:[e,t]}},q=[{region:0,start:"55.7276995,36.8193915",stop:"55.69928816060674,37.39474443074465",length:56425,time:2792},{region:0,start:"55.7276995,36.8193915",stop:"55.60238311111584,36.483017680936115",length:30452,time:1790},{region:0,start:"55.7276995,36.8193915",stop:"55.62968055298542,37.021400723452174",length:22476,time:1430},{region:0,start:"55.62968055298542,37.021400723452174",stop:"55.69928816060674,37.39474443074465",length:31326,time:1808},{region:0,start:"55.69928816060674,37.39474443074465",stop:"55.905786101735075,37.7174511711464",length:46435,time:2667},{region:0,start:"55.69928816060674,37.39474443074465",stop:"55.913241655910504,37.8378230903432",length:50578,time:2600},{region:0,start:"55.913241655910504,37.8378230903432",stop:"55.905786101735075,37.7174511711464",length:11600,time:1174},{region:0,start:"55.69928816060674,37.39474443074465",stop:"55.65943211246696,37.92773938370481",length:47717,time:2627},{region:0,start:"55.65619605179316,38.10076639140717",stop:"55.408054,36.7174221",length:112201,time:6766},{region:0,start:"55.60238311111584,36.483017680936115",stop:"55.7276995,36.8193915",length:32653,time:1924}],K=[[]],N=[],U=[],V=[],Z=[],G=[],Q=[{}],$=!1,ee=!0,te=!1,ne=!1,oe=!1,re=!1,ae=1,ie=0,ce=0,se=0,de=0,ue=0,le=0,be=-1,he=-1,je=-1,pe="",xe=function(){var e=Object(b.c)((function(e){return e.massdkReducer.massdk})),t=Object(b.c)((function(e){return e.massrouteReducer.massroute})),n=Object(b.c)((function(e){return e.mapReducer.map}));n&&(Q=n.dateMap.tflight,ee=!1);var r=Object(b.b)();if(!$&&!ee){for(var a=0;a<Q.length;a++){var i={ID:-1,coordinates:[],nameCoordinates:"",region:"",area:"",subarea:0,newCoordinates:0},c=[0,0];c[0]=Q[a].points.Y,c[1]=Q[a].points.X,i.ID=Q[a].ID,i.coordinates=c,i.nameCoordinates=Q[a].description,i.region=Q[a].region.num,i.area=Q[a].area.num,i.subarea=Q[a].subarea,i.newCoordinates=0,e.push(i),K.push(c)}K.splice(0,1),ie=function(e,t,n,o){var r=(e-n)/2+n;e<n&&(r=(n-e)/2+e);var a=(t-o)/2+o;return t<o&&(a=(o-t)/2+t),[r,a]}(n.dateMap.boxPoint.point0.Y,n.dateMap.boxPoint.point0.X,n.dateMap.boxPoint.point1.Y,n.dateMap.boxPoint.point1.X),ce=ie,$=!0,t=q,r(function(){return{type:d,data:arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]}}(e)),r(h(t))}var s=o.useState(9.5),u=Object(g.a)(s,2),l=u[0],p=u[1],C=o.useState(!1),R=Object(g.a)(C,2),A=R[0],E=R[1],F=o.useState(!1),I=Object(g.a)(F,2),B=I[0],xe=I[1],ge=o.useState(!1),me=Object(g.a)(ge,2),Oe=me[0],fe=me[1],ve=o.useState(!1),ke=Object(g.a)(ve,2),we=ke[0],Se=ke[1],Ce=o.useState(!1),Re=Object(g.a)(Ce,2),ye=Re[0],Me=Re[1],We=function(){se=0,ue=0,de=0,le=0,he=-1,je=-1,N=[],U=[],V=[],Z=[],ne=!1,oe=!1,ie=ce,Pe(window.innerWidth+Math.random())},Ae=function(){for(var e=!1,n=_(se),o=_(ue),r=0;r<t.length;r++)t[r].start===n&&t[r].stop===o&&(e=!0);e?(pe="\u041d\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e - \u0434\u0443\u0431\u043b\u0438\u043a\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c",xe(!0)):(t.push(function(e,t,n){var o={region:0,start:"",stop:"",length:0,time:0};return o.start=e,o.stop=t,n&&(o.time=Math.round(n.properties.get("duration").value),o.length=Math.round(n.properties.get("distance").value)),o}(n,o,j)),We())},Ee={center:ie,zoom:l,yandexMapDisablePoiInteractivity:!0},Fe=function(n){var a=o.useRef(null),i=n.pointa,c=n.pointb,s=function(){se=de,ue=le,ne=!0,Pe(window.innerWidth+Math.random())},d=function(n){ie=ce,0===de?(he=n,de=[e[n].coordinates[0],e[n].coordinates[1]],function(){for(var e=0;e<t.length;e++)t[e].start===_(de)&&(N.push(de),U.push(L(t[e].stop))),t[e].stop===_(de)&&(V.push(L(t[e].start)),Z.push(de))}(),te=!0,Pe(window.innerWidth+Math.random())):0===le?he===n?(pe="\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u0430\u044f \u0438 \u043a\u043e\u043d\u0435\u0447\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0438 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442",xe(!0)):(je=n,le=[e[n].coordinates[0],e[n].coordinates[1]],s()):(be=n,Se(!0))},u=function(){var n=o.useState(!1),a=Object(g.a)(n,2),i=a[0],c=a[1],d=0;be>=0&&be<e.length&&(d=[e[be].coordinates[0],e[be].coordinates[1]]);var u=function(n,o){return Object(D.jsx)(O.a,{sx:W,onClick:function(){return function(n){switch(n){case 1:je===be?(pe="\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u0430\u044f \u0438 \u043a\u043e\u043d\u0435\u0447\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0438 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442",c(!0)):(he=be,de=d,s());break;case 2:he===be?(pe="\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u0430\u044f \u0438 \u043a\u043e\u043d\u0435\u0447\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0438 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442",c(!0)):(je=be,le=d,s());break;case 3:if(he===be||je===be)pe="\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u0443\u044e \u0438 \u043a\u043e\u043d\u0435\u0447\u043d\u0443\u044e \u0442\u043e\u0447\u043a\u0438 \u0443\u0434\u0430\u043b\u044f\u0442\u044c \u043d\u0435\u043b\u044c\u0437\u044f",c(!0);else{for(var o=[],a=_(K[be]),i=0;i<t.length;i++)a!==t[i].start&&a!==t[i].stop&&o.push(t[i]);t.splice(0,t.length),G=t=o,r(h(t)),N=[],U=[],V=[],Z=[],e.splice(be,1),K.splice(be,1),Se(!1),ie=ce,Pe(window.innerWidth+Math.random())}break;case 4:Me(!0)}}(o)},children:Object(D.jsx)("b",{children:n})})};return Object(D.jsx)(f.a,{open:we,onClose:function(){return Se(!1)},hideBackdrop:!0,children:Object(D.jsxs)(m.a,{sx:y,children:[Object(D.jsx)(O.a,{sx:M,onClick:function(){return Se(!1)},children:Object(D.jsx)("b",{children:"\u2716"})}),Object(D.jsxs)(m.a,{sx:{marginTop:2,textAlign:"center"},children:[u("\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u0442\u043e\u0447\u043a\u0438",3),u("\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0430\u0434\u0440\u0435\u0441\u0430",4)]}),Object(D.jsx)(v.a,{variant:"h6",sx:S,children:"\u041f\u0435\u0440\u0435\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 \u0441\u0432\u044f\u0437\u0438:"}),Object(D.jsxs)(m.a,{sx:{textAlign:"center"},children:[u("\u041d\u0430\u0447\u0430\u043b\u044c\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0430",1),u("\u041a\u043e\u043d\u0435\u0447\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0430",2)]}),ye&&Object(D.jsx)(T,{iPoint:be,setOpen:Me}),i&&Object(D.jsx)(H,{sErr:pe,setOpen:c})]})})};return Object(D.jsx)(k.i,{query:{apikey:"65162f5f-2d15-41d1-a881-6c1acf34cfa1",lang:"ru_RU"},children:Object(D.jsxs)(k.c,{modules:["multiRouter.MultiRoute","Polyline"],state:Ee,instanceRef:function(t){t&&(a.current=t,a.current.events.add("contextmenu",(function(t){a.current.hint&&(e.push(function(e,t){var n={ID:0,coordinates:[],nameCoordinates:"",region:"",area:"",subarea:0,newCoordinates:0};return n.ID=0,n.coordinates=e,n.nameCoordinates="\u041d\u043e\u0432\u0430\u044f \u0442\u043e\u0447\u043a\u0430 "+String(t),n.region="",n.area="",n.subarea=0,n.newCoordinates=1,n}(t.get("coords"),ae++)),K.push(t.get("coords")),Pe(window.innerWidth+Math.random()))})),a.current.events.add("mousedown",(function(e){0===e.get("domEvent").originalEvent.button&&(ce=ie,ie=e.get("coords"))})),a.current.events.add(["boundschange"],(function(){p(a.current.getZoom())})))},onLoad:function(e){for(var t=new e.multiRouter.MultiRoute(Y(i,c),{routeActiveStrokeWidth:5,routeStrokeWidth:1.5}),n=[],o=0;o<G.length;o++)n[o]=new e.Polyline([L(G[o].start),L(G[o].stop)],{balloonContent:"\u041b\u043e\u043c\u0430\u043d\u0430\u044f \u043b\u0438\u043d\u0438\u044f"},{balloonCloseButton:!1,strokeColor:"#1A9165",strokeWidth:3}),a.current.geoObjects.add(n[o]);for(var r=[],s=0;s<N.length;s++)r[s]=new e.multiRouter.MultiRoute(Y(N[s],U[s]),{balloonCloseButton:!1,routeStrokeStyle:"dot",strokeColor:"#1A9165",routeActiveStrokeWidth:3,routeStrokeWidth:0}),a.current.geoObjects.add(r[s]);for(var d=[],u=0;u<V.length;u++)d[u]=new e.multiRouter.MultiRoute(Y(V[u],Z[u]),{routeActiveStrokeWidth:3,routeStrokeStyle:"dot",routeActiveStrokeColor:"#E91427",routeStrokeWidth:0}),a.current.geoObjects.add(d[u]);a.current.geoObjects.add(t),t.model.events.add("requestsuccess",(function(){j=t.getActiveRoute()}))},width:"99.8%",height:"97%",children:[K.map((function(t,n){return Object(D.jsx)(k.d,{geometry:t,properties:J(n,he,je,e),options:X(n,he,je,e),modules:["geoObject.addon.balloon","geoObject.addon.hint"],onClick:function(){return d(n)}},n)})),Object(D.jsx)(k.a,{}),Object(D.jsx)(k.b,{options:{float:"left"}}),Object(D.jsx)(k.e,{options:{float:"right"}}),Object(D.jsx)(k.f,{options:{float:"left",provider:"yandex#search",size:"large"}}),Object(D.jsx)(k.g,{options:{float:"right"}}),Object(D.jsx)(k.h,{options:{float:"right"}}),Object(D.jsx)(k.j,{options:{float:"right"}}),Object(D.jsx)(u,{}),B&&Object(D.jsx)(H,{sErr:pe,setOpen:xe}),A&&Object(D.jsx)(P,{activeRoute:j,name1:e[he].nameCoordinates,name2:e[je].nameCoordinates,setOpen:E}),Oe&&Object(D.jsx)(z,{setOpen:fe})]})})},Ie=o.useState(0),De=Object(g.a)(Ie,2),Pe=(De[0],De[1]);o.useLayoutEffect((function(){function e(){Pe(window.innerWidth)}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]);var Be=function(e,n){return Object(D.jsx)(O.a,{sx:w,onClick:function(){return function(e){switch(e){case 3:G=t,re=!0,Pe(window.innerWidth+Math.random());break;case 6:G=[],re=!1,Pe(window.innerWidth+Math.random());break;case 12:var n=se;se=ue,ue=n,n=de,de=le,le=n,n=he,he=je,je=n,Pe(window.innerWidth+Math.random());break;case 21:Ae(),te=!1;break;case 33:oe=!0,fe(!0);break;case 69:j&&E(!0);break;case 77:We()}}(n)},children:Object(D.jsx)("b",{children:e})})};return Object(D.jsxs)(x.a,{container:!0,sx:{height:"99.5vh"},children:[te&&!oe&&Object(D.jsx)(D.Fragment,{children:Be("\u041e\u0442\u043c\u0435\u043d\u0430 \u043d\u0430\u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0439",77)}),te&&ne&&!oe&&Object(D.jsxs)(D.Fragment,{children:[Be("\u041f\u0440\u0438\u0432\u044f\u0437\u043a\u0430 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d",33),Be("\u0420\u0435\u0432\u0435\u0440\u0441 \u0441\u0432\u044f\u0437\u0438",12),Be("\u0418\u043d\u0444\u043e\u0440\u043c \u043e \u0441\u0432\u044f\u0437\u0438",69)]}),te&&ne&&oe&&Object(D.jsxs)(D.Fragment,{children:[Be("\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0441\u0432\u044f\u0437\u044c",21),Be("\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0441\u0432\u044f\u0437\u044c",77),Be("\u0418\u043d\u0444\u043e\u0440\u043c \u043e \u0441\u0432\u044f\u0437\u0438",69)]}),!re&&Object(D.jsx)(D.Fragment,{children:Be("Demo \u0441\u0435\u0442\u0438",3)}),re&&Object(D.jsx)(D.Fragment,{children:Be("\u041a\u043e\u043d\u0435\u0446 Demo",6)}),!ee&&Object(D.jsx)(Fe,{pointa:se,pointb:ue})]})},ge=!0,me=null,Oe=function(){var e=Object(b.b)(),t="wss://"+window.location.host+window.location.pathname+"W"+window.location.search;return ge&&(me=new WebSocket(t),ge=!1,console.log("WS:",me)),r.a.useEffect((function(){me.onopen=function(e){console.log("WS.current.onopen:",e)},me.onclose=function(e){console.log("WS.current.onclose:",e)},me.onerror=function(e){console.log("WS.current.onerror:",e)},me.onmessage=function(t){var n=JSON.parse(t.data),o=n.data;switch(console.log("\u043f\u0440\u0438\u0448\u043b\u043e:",n.type,o),n.type){case"mapInfo":console.log("mapInfo:",o),e({type:u,data:{dateMap:p=o}});break;case"graphInfo":console.log("graphInfo:",o);break;default:console.log("data_default:",o)}}}),[e]),Object(D.jsx)(x.a,{container:!0,sx:{height:"100vh",width:"100%",bgcolor:"#F1F5FB"},children:Object(D.jsx)(x.a,{item:!0,xs:!0,children:Object(D.jsx)(xe,{})})})},fe={massdk:[]},ve={massroute:[]},ke={map:p},we=Object(c.a)({mapReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ke,t=arguments.length>1?arguments[1]:void 0;return t.type===u?Object(s.a)(Object(s.a)({},e),{},{map:t.data}):e},massdkReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:fe,t=arguments.length>1?arguments[1]:void 0;return t.type===d?Object(s.a)(Object(s.a)({},e),{},{massdk:t.data}):e},massrouteReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ve,t=arguments.length>1?arguments[1]:void 0;return t.type===l?Object(s.a)(Object(s.a)({},e),{},{massroute:t.data}):e}}),Se=(n(86),Object(c.b)(we));i.a.render(Object(D.jsx)(b.a,{store:Se,children:Object(D.jsx)(Oe,{})}),document.getElementById("root"))}},[[87,1,2]]]);
//# sourceMappingURL=main.90b1046b.chunk.js.map