import{j as n}from"./jsx-runtime-EKYJJIwR.js";import{r as s}from"./iframe-CssO88Nv.js";import{c as m}from"./clsx-B-dksMZM.js";import{E,I as h}from"./internal-link-C8EtABcm.js";import{T as d}from"./index-B6BlTgrd.js";import"./index-C9ey9foM.js";import"./index-CDefQKQj.js";import"./index-DyInFnvy.js";import"./index-CXigVvjw.js";import{H as v}from"./heading-DdrGd4jE.js";import"./preload-helper-CmCXLAn_.js";import"./paragraph-DsF-5czg.js";import"./constants-C0G6BcTz.js";import"./constants-mr6oDAjr.js";import"./theme-B7rhewEt.js";const b=r=>{const e=s.useRef(null);return s.useEffect(()=>{e.current&&e.current.scrollWidth>e.current.clientWidth&&r(!0)},[r]),s.useEffect(()=>{if(!e.current)return;const t=e.current,a=()=>{t.offsetWidth+t.scrollLeft>=t.scrollWidth?r(!1):r(!0)};return t.addEventListener("scroll",a),()=>{t.removeEventListener("scroll",a)}},[r]),e},f=({text:r,link:e,isExternal:t=!1,isActive:a=!1,onClick:l,className:o=""})=>{const c=t?E:h;return n.jsx("button",{className:m("flex shrink-0 mr-[24px] last:mr-0",o),onClick:l,type:"button",children:n.jsx(c,{to:e,children:n.jsx(d,{text:r,active:a,size:d.Size.l,className:"py-[16px]"})})})};f.__docgenInfo={description:"",methods:[],displayName:"TabItem",props:{text:{required:!0,tsType:{name:"string"},description:""},link:{required:!0,tsType:{name:"string"},description:""},isExternal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isActive:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const x=({title:r,tabs:e=[],activeTabIndex:t=0})=>{const[a,l]=s.useState(t),[o,c]=s.useState(!1),g=b(c);return s.useEffect(()=>{l(t)},[t]),n.jsxs("div",{className:"flex flex-col w-full text-gray-800",children:[n.jsx(v,{text:r}),e.length>0?n.jsx("div",{ref:g,className:m("flex items-center","overflow-x-scroll scrollbar:!w-0",{"[mask-image:linear-gradient(to_left,rgba(241,241,241,0),#f1f1f1_48px)] [-webkit-mask-image:linear-gradient(to_left,rgba(241,241,241,0),#f1f1f1_48px)]":o}),children:e.map((p,u)=>{const w={...p,isActive:u===a},k=()=>{l(u)};return s.createElement(f,{...w,key:`tab-${p.text}-${u}`,onClick:k})})}):null,n.jsx("div",{className:m("w-full h-[1px] bg-gray-300 mt-[0px]","desktop:mt-[0px]")})]})};x.__docgenInfo={description:"",methods:[],displayName:"TitleTab",props:{title:{required:!0,tsType:{name:"string"},description:""},tabs:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  text: string
  link: string
  isExternal?: boolean
  isActive?: boolean
}`,signature:{properties:[{key:"text",value:{name:"string",required:!0}},{key:"link",value:{name:"string",required:!0}},{key:"isExternal",value:{name:"boolean",required:!1}},{key:"isActive",value:{name:"boolean",required:!1}}]}}],raw:"Tab[]"},description:"",defaultValue:{value:"[]",computed:!1}},activeTabIndex:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}}}};const G={title:"Title Bar/Title Tab",component:x},i={args:{title:"主分類",tabs:[{text:"子分類1",isExternal:!0,link:"https://www.google.com"},{text:"子分類2",isExternal:!0,link:"https://www.google.com"},{text:"子分類3",isExternal:!0,link:"https://www.google.com"},{text:"子分類4",isExternal:!0,link:"https://www.google.com"},{text:"子分類5",isExternal:!0,link:"https://www.google.com"},{text:"子分類6",isExternal:!0,link:"https://www.google.com"}]},parameters:{controls:{exclude:["className"]}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: '主分類',
    tabs: [{
      text: '子分類1',
      isExternal: true,
      link: 'https://www.google.com'
    }, {
      text: '子分類2',
      isExternal: true,
      link: 'https://www.google.com'
    }, {
      text: '子分類3',
      isExternal: true,
      link: 'https://www.google.com'
    }, {
      text: '子分類4',
      isExternal: true,
      link: 'https://www.google.com'
    }, {
      text: '子分類5',
      isExternal: true,
      link: 'https://www.google.com'
    }, {
      text: '子分類6',
      isExternal: true,
      link: 'https://www.google.com'
    }]
  },
  parameters: {
    controls: {
      exclude: ['className']
    }
  }
}`,...i.parameters?.docs?.source}}};const H=["Basic"];export{i as Basic,H as __namedExportsOrder,G as default};
