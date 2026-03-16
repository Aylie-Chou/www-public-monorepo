import{j as e}from"./jsx-runtime-EKYJJIwR.js";import{c as o}from"./clsx-B-dksMZM.js";import{d as c}from"./heading-DdrGd4jE.js";import{P as m}from"./paragraph-DsF-5czg.js";import{T as u}from"./index-B6BlTgrd.js";import"./index-C9ey9foM.js";import"./index-CDefQKQj.js";import"./index-DyInFnvy.js";import"./index-CXigVvjw.js";import"./iframe-CssO88Nv.js";import"./preload-helper-CmCXLAn_.js";import"./constants-C0G6BcTz.js";import"./constants-mr6oDAjr.js";import"./theme-B7rhewEt.js";const l=({title:a,subtitle:t="",renderButton:n=null,className:i=""})=>e.jsxs("div",{className:o("flex justify-between flex-col",i),children:[e.jsxs("div",{className:"flex flex-row justify-between",children:[e.jsxs("div",{className:o("flex items-baseline gap-[16px]"),children:[e.jsx(c,{className:"text-gray-800",text:a}),t?e.jsx(m,{className:"text-gray-600",text:t}):null]}),n||null]}),e.jsx("div",{className:o("w-full h-[1px] bg-gray-800 mt-[8px]","desktop:mt-[16px]")})]});l.__docgenInfo={description:"",methods:[],displayName:"Title2",props:{title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},renderButton:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"",defaultValue:{value:"null",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const v={title:"Title Bar/Title2",component:l},s={args:{title:"RWD 標題",subtitle:"副標"},parameters:{controls:{exclude:["className"]}}},r={render:a=>{const t=e.jsx(u,{text:"NOT RWD 按鈕"});return e.jsx(l,{...a,renderButton:t})},args:{title:"RWD 標題",subtitle:"副標"},parameters:{controls:{exclude:["className","renderButton"]}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'RWD 標題',
    subtitle: '副標'
  },
  parameters: {
    controls: {
      exclude: ['className']
    }
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => {
    const buttonJSX = <TextButton text="NOT RWD 按鈕" />;
    return <Title2 {...args} renderButton={buttonJSX} />;
  },
  args: {
    title: 'RWD 標題',
    subtitle: '副標'
  },
  parameters: {
    controls: {
      exclude: ['className', 'renderButton']
    }
  }
}`,...r.parameters?.docs?.source}}};const D=["Basic","WithButton"];export{s as Basic,r as WithButton,D as __namedExportsOrder,v as default};
