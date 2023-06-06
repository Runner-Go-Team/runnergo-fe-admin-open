import React, { useRef, useEffect, useState } from 'react';
import { Tooltip } from '@arco-design/web-react';

const MyComponent = (props) => {
  const { parentRef } = props;
  const childRef = useRef(null);
  const [remainingWidth, setRemainingWidth] = useState(null);
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  useEffect(() => {
    const parentElement = parentRef.current;
    const childElement = childRef.current;

    const parentWidth = parentElement.offsetWidth;
    const childWidth = childElement.offsetWidth;
    const remainingWidth = parentWidth - childWidth;
    
    setRemainingWidth(remainingWidth);
  }, []);
  useEffect(() => {
    const containerWidth = parentRef.current.offsetWidth;
    const textWidth = childRef.current.scrollWidth;
    setIsTextOverflow(textWidth > containerWidth);
  }, []);
  return (
    <div ref={childRef}>
    {isTextOverflow ? (
      <Tooltip content={"text"}>
        <span>{"text"}</span>
      </Tooltip>
    ) : (
      <span>{"text"}</span>
    )}
  </div>
  );
};

export default MyComponent;
