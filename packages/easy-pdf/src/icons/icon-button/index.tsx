import "./index.css";

const IconButton = ({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) => {
  return (
    <span title={title} className="easy-pdf-icon-button" onClick={onClick}>
      {icon}
    </span>
  );
};

export default IconButton;
