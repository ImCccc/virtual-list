import check from "./check.png";
import expand from "./expand.png";
import fold from "./fold.png";
import radioCheck from "./radio-check.png";
import radioUnCheck from "./radio-uncheck.png";
import someCheck from "./someCheck.png";
import unCheck from "./unCheck.png";
const iconStyle = { width: 16, height: 16 };
type IconProps = {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  [k: string]: any;
};
export const FoldIcon: React.FC<IconProps> = (props) => (
  <img src={expand} style={iconStyle} {...props} />
);
export const ExpandIcon: React.FC<IconProps> = (props) => (
  <img src={fold} style={iconStyle} {...props} />
);
export const CheckIcon: React.FC<IconProps> = (props) => (
  <img src={check} style={iconStyle} {...props} />
);
export const UnCheckIcon: React.FC<IconProps> = (props) => (
  <img src={unCheck} style={iconStyle} {...props} />
);
export const SomeCheckIcon: React.FC<IconProps> = (props) => (
  <img src={someCheck} style={iconStyle} {...props} />
);
export const RadioCheckIcon: React.FC<IconProps> = (props) => (
  <img src={radioCheck} style={iconStyle} {...props} />
);
export const RadioUnCheckIcon: React.FC<IconProps> = (props) => (
  <img src={radioUnCheck} style={iconStyle} {...props} />
);
