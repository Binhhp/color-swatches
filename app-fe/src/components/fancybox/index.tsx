import { useEffect, type PropsWithChildren, useRef, type FC } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
interface Props {
  delegate?: string;
  src?: string;
}
const FancyBox: FC<PropsWithChildren<Props>> = ({ children, delegate, src }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    const delegateValue = delegate || "[data-fancybox]";
    NativeFancybox.bind(container, delegateValue, {
      hideScrollbar: true,
      closeButton: "auto",
      showClass: "fancybox-fadeIn"
    });

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });
  return (
    <div ref={containerRef}>
      <a href='javascripts:void(0);' data-fancybox='gallery' data-src={src}>
        {children}
      </a>
    </div>
  );
};

export default FancyBox;
