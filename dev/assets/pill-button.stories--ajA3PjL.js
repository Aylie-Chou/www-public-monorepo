import{j as m}from"./jsx-runtime-EKYJJIwR.js";import{g as t}from"./get-enum-arg-y2kIuzNl.js";import{P as e}from"./index-DyInFnvy.js";import{C as r}from"./index-BHdmU5RP.js";import{R as s}from"./release-branch-D9ze_MWd.js";import"./iframe-CssO88Nv.js";import"./preload-helper-CmCXLAn_.js";import"./clsx-B-dksMZM.js";import"./paragraph-DsF-5czg.js";import"./constants-C0G6BcTz.js";import"./constants-mr6oDAjr.js";import"./theme-B7rhewEt.js";const T={title:"Button/PillButton",component:e,argTypes:{type:t(e.Type,e.Type.primary),size:t(e.Size,e.Size.s),theme:t(e.Theme,e.Theme.normal),style:t(e.Style,e.Style.dark),showLeft:{control:"boolean"},showRight:{control:"boolean"}}},o={args:{text:"文字",type:e.Type.primary,size:e.Size.s,theme:e.Theme.normal,style:e.Style.dark,disabled:!1,loading:!1},parameters:{controls:{exclude:["className","leftIconComponent","rightIconComponent","showLeft","showRight"]}}},n={args:{text:"文字",type:e.Type.primary,size:e.Size.s,theme:e.Theme.normal,style:e.Style.dark,disabled:!1,loading:!1,showLeft:!0,showRight:!0},parameters:{controls:{exclude:["className","leftIconComponent","rightIconComponent"]}},render:({showLeft:a,showRight:l,...i})=>m.jsx(e,{...i,leftIconComponent:a?r(s.master):void 0,rightIconComponent:l?r(s.master):void 0})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: '文字',
    type: PillButton.Type.primary,
    size: PillButton.Size.s,
    theme: PillButton.Theme.normal,
    style: PillButton.Style.dark,
    disabled: false,
    loading: false
  },
  parameters: {
    controls: {
      exclude: ['className', 'leftIconComponent', 'rightIconComponent', 'showLeft', 'showRight']
    }
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    text: '文字',
    type: PillButton.Type.primary,
    size: PillButton.Size.s,
    theme: PillButton.Theme.normal,
    style: PillButton.Style.dark,
    disabled: false,
    loading: false,
    showLeft: true,
    showRight: true
  },
  parameters: {
    controls: {
      exclude: ['className', 'leftIconComponent', 'rightIconComponent']
    }
  },
  render: ({
    showLeft,
    showRight,
    ...rest
  }) => <PillButton {...rest} leftIconComponent={showLeft ? Cross(RELEASE_BRANCH.master) : undefined} rightIconComponent={showRight ? Cross(RELEASE_BRANCH.master) : undefined} />
}`,...n.parameters?.docs?.source}}};const w=["Basic","ToggleIconDisplay"];export{o as Basic,n as ToggleIconDisplay,w as __namedExportsOrder,T as default};
