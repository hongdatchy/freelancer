"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBtn() {
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    const handleSearch = (value?: string) => {
        const keyword = value ?? inputValue;

        if (!keyword.trim()) {
            router.push("/search-post");
            return;
        }

        router.push(`/search-post?keyword=${encodeURIComponent(keyword)}`);
    };

    const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleBlur = () => {
        handleSearch();
    };

    const clearSearch = () => {
        setInputValue("");
        router.push("/search-post");
    };

    return (
        <div className="relative w-full">
            <Input
                placeholder="Search blog..."
                className="w-full pr-10"
                value={inputValue}
                onChange={searchOnChange}
                onKeyDown={handleKeyPress}
                onBlur={handleBlur}
            />

            {inputValue && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}