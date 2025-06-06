import React from "react";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";

const DropdownConfirm = (props) => {
  const { className, label, children } = props;

  return (
    <div className={`dropdown-confirm ${className}`}>
      <UncontrolledButtonDropdown>
        <DropdownToggle nav>
          <div className="dropdown-action sm">
            {label}
            <span className="fa fa-chevron-down dropdown-caret"></span>
          </div>
        </DropdownToggle>
        <DropdownMenu right>{children}</DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  );
};

DropdownConfirm.defaultProps = {
  label: ""
};

export default DropdownConfirm;
