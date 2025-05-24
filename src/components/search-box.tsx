import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface SearchBoxProps {
	initialValue: string | undefined;
	onSubmit: (value: string) => void | Promise<void>;
}

export function SearchBox({ initialValue, onSubmit }: SearchBoxProps) {
	const [inputValue, setInputValue] = useState(initialValue || "");

	return (
		<div className="flex gap-2">
			<Input
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
