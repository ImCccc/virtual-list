import check from "./check.png";
import expand from "./expand.png";
import fold from "./fold.png";
import radioCheck from "./radio-check.png";
import radioUnCheck from "./radio-uncheck.png";
import someCheck from "./someCheck.png";
import unCheck from "./unCheck.png";

import disabledCheck from "./disabled-check.png";
import disabledUnCheck from "./disabled-unCheck.png";
import disabledRadioCheck from "./disabled-radio-check.png";
import disabledRadioUncheck from "./disabled-radio-uncheck.png";

const iconStyle = { width: 16, height: 16 };
type IconProps = React.FC<{
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  [k: string]: any;
}>;

export const FoldIcon: IconProps = (props) => (
  <img src={expand} style={iconStyle} {...props} />
);
export const ExpandIcon: IconProps = (props) => (
  <img src={fold} style={iconStyle} {...props} />
);
export const CheckIcon: IconProps = ({ onClick, disabled, ...props }) => {
  const _onClick = () => !disabled && onClick?.();
  return (
    <img
      onClick={_onClick}
      style={iconStyle}
      src={disabled ? disabledCheck : check}
      {...props}
    />
  );
};
export const UnCheckIcon: IconProps = ({ onClick, disabled, ...props }) => {
  const _onClick = () => !disabled && onClick?.();
  return (
    <img
      onClick={_onClick}
      style={iconStyle}
      src={disabled ? disabledUnCheck : unCheck}
      {...props}
    />
  );
};
export const SomeCheckIcon: IconProps = ({ onClick, disabled, ...props }) => {
  const _onClick = () => !disabled && onClick?.();
  return (
    <img src={someCheck} onClick={_onClick} style={iconStyle} {...props} />
  );
};
export const RadioCheckIcon: IconProps = ({ onClick, disabled, ...props }) => {
  const _onClick = () => !disabled && onClick?.();
  return (
    <img
      onClick={_onClick}
      style={iconStyle}
      src={disabled ? disabledRadioCheck : radioCheck}
      {...props}
    />
  );
};
export const RadioUnCheckIcon: IconProps = ({
  onClick,
  disabled,
  ...props
}) => {
  const _onClick = () => !disabled && onClick?.();
  return (
    <img
      onClick={_onClick}
      style={iconStyle}
      src={disabled ? disabledRadioUncheck : radioUnCheck}
      {...props}
    />
  );
};
