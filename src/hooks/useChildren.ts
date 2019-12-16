import React, { ReactNode } from "react";

const useChildProps = (children: ReactNode = [], whitelist: string[]) => {
  return React.useMemo(
    () =>
      [].concat(children).reduce((childProps, child) => {
        if (whitelist && !whitelist.includes(child.type)) {
          throw Error(`element <${child.type}> is not supported`);
        }

        childProps[child.type] = child.props;

        return childProps;
      }, {}),
    [children, whitelist]
  );
};

export default useChildProps;
