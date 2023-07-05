import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react'
import { Input } from '@arco-design/web-react';
import { isPromise } from '@utils';
import { isFunction, isString } from 'lodash';

const TextInput = (props, ref) => {
  const { value, onChange, placeholder, maxLength } = props;
  const [view, setView] = useState(true);
  const [text, setText] = useState(value);

  useEffect(() => {
    if (isString(value)) {
      setText(value);
    }
  }, [value]);

  const toggleView = () => {
    setView(!view);
  }

  useImperativeHandle(ref, () => ({
    toggleView,
  }));

  return (<>
    {view ? <div className='text-view text-ellipsis'>{text}</div> : <Input autoFocus allowClear maxLength={maxLength} value={text} placeholder={placeholder || ''} onChange={(val)=>{
      setText(val);
    }} onBlur={async ()=>{
      toggleView();
      
      if(isFunction(onChange) && text != value){
        const result = onChange(text);
        if(isPromise(result)){
          try {
            await result;
          } catch (error) {
            setText(value);
          }
        }else{
          if(result == false || result == undefined){
            setText(value);
          }
        
        }
      }
    }} />}
  </>

  )
}

export default forwardRef(TextInput);