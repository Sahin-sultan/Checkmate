import { Button } from "@/components/ui/button";

interface AddButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "default" | "purple" | "green" | "green-light" | "loading" | "success" | "error";
}

const AddButton = ({ label, onClick, variant = "green" }: AddButtonProps) => {
  return (
    <Button variant={variant} className="mt-6 w-full" onClick={onClick}>
      {label}
    </Button>
  );
};

export default AddButton;
