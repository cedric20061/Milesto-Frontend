import React, { ReactNode } from "react";
import { Button } from "../ui/button";

interface VerificationDisplayerProps {
  validFonction: () => unknown;
  children: ReactNode;
  onClose: () => unknown
}
const VerificationDisplayer: React.FC<VerificationDisplayerProps> = ({
  validFonction,
  children,
  onClose
}) => {
  return (
    <div>
      {children}
      <div className="flex justify-end space-x-2">
        <Button type="submit" onClick={validFonction}>
          Yes
        </Button>
        <Button type="submit" onClick={onClose}>
          No
        </Button>
      </div>
    </div>
  );
};

export default VerificationDisplayer;
