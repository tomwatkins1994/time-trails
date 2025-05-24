import { SearchIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export interface SearchBoxProps
	extends Omit<ComponentProps<"div">, "onSubmit"> {
	initialValue: string | undefined;
	onSubmit: (value: string) => void | Promise<void>;
}

export function SearchBox({
	initialValue,
	onSubmit,
	className,
	...props
}: SearchBoxProps) {
	const [inputValue, setInputValue] = useState(initialValue || "");

	return (
		<div
			className={cn(
				"flex gap-2 bg-white dark:bg-input/30 p-1 rounded-xl shadow-xs border border-input",
				className,
			)}
			{...props}
		>
			<Input
				className="border-none outline-0 focus:ring-0 focus:ring-offset-0 focus-visible:border-none focus-visible:ring-0 shadow-none"
				placeholder="Search"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyUp={(e) => e.key === "Enter" && onSubmit(inputValue)}
			/>
			<Button onClick={() => onSubmit(inputValue)}>
				<SearchIcon />
			</Button>
		</div>
	);
}
