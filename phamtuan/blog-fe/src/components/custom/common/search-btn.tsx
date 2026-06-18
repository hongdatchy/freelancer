"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBtn() {
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();

    const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && inputValue !== '') {
            router.push(`/search-post?keyword=${inputValue}`);
        }
    };

    return (
        <>
            <Input placeholder="Search blog..." className="w-full" onChange={searchOnChange} onKeyDown={handleKeyPress} />
        </>
    );
}