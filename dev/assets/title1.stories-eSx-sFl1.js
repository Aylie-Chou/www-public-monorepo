import{j as e}from"./jsx-runtime-EKYJJIwR.js";import{c as r}from"./clsx-B-dksMZM.js";import{a as i}from"./heading-DdrGd4jE.js";import{a as m}from"./paragraph-DsF-5czg.js";import"./iframe-CssO88Nv.js";import"./preload-helper-CmCXLAn_.js";import"./constants-C0G6BcTz.js";const l=({title:n,subtitle:o="",className:c=""})=>e.jsxs("div",{className:r("flex justify-between flex-col",c),children:[e.jsxs("div",{className:r("flex items-baseline gap-[16px]"),children:[e.jsx(i,{className:"text-gray-800",text:n}),o?e.jsx(m,{className:"text-gray-600",text:o}):null]}),e.jsx("div",{className:r("w-full h-[1px] bg-gray-300 mt-[8px]","desktop:mt-[16px]")})]});l.__docgenInfo={description:"",methods:[],displayName:"Title1",props:{title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const b={title:"Title Bar/Title1",component:l},s={args:{title:"標題",subtitle:"副標"},parameters:{controls:{exclude:["className"]}}},a={args:{title:"#報導者"},parameters:{controls:{exclude:["subtitle","className"]}}},t={args:{title:"我的書籤",subtitle:"全部 55"},parameters:{controls:{exclude:["className"]}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: '標題',
    subtitle: '副標'
  },
  parameters: {
    controls: {
      exclude: ['className']
    }
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: '#報導者'
  },
  parameters: {
    controls: {
      exclude: ['subtitle', 'className']
    }
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: '我的書籤',
    subtitle: '全部 55'
  },
  parameters: {
    controls: {
      exclude: ['className']
    }
  }
}`,...t.parameters?.docs?.source}}};const B=["Basic","TagBar","BookmarkBar"];export{s as Basic,t as BookmarkBar,a as TagBar,B as __namedExportsOrder,b as default};
