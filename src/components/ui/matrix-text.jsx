"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MatrixText = ({
    text = "HelloWorld!",
    className,
    letterClassName,
    initialDelay = 200,
    letterAnimationDuration = 500,
    letterInterval = 100,
}) => {
    const [letters, setLetters] = useState(() =>
        text.split("").map((char) => ({
            char,
            isMatrix: false,
            isSpace: char === " ",
        }))
    );
    const [isAnimating, setIsAnimating] = useState(false);

    const getRandomChar = useCallback(
        () => (Math.random() > 0.5 ? "1" : "0"),
        []
    );

    const animateLetter = useCallback(
        (index) => {
            if (index >= text.length) return;

            requestAnimationFrame(() => {
                setLetters((prev) => {
                    const newLetters = [...prev];
                    if (!newLetters[index].isSpace) {
                        newLetters[index] = {
                            ...newLetters[index],
                            char: getRandomChar(),
                            isMatrix: true,
                        };
                    }
                    return newLetters;
                });

                setTimeout(() => {
                    setLetters((prev) => {
                        const newLetters = [...prev];
                        newLetters[index] = {
                            ...newLetters[index],
                            char: text[index],
                            isMatrix: false,
                        };
                        return newLetters;
                    });
                }, letterAnimationDuration);
            });
        },
        [getRandomChar, text, letterAnimationDuration]
    );

    const startAnimation = useCallback(() => {
        if (isAnimating) return;

        setIsAnimating(true);
        let currentIndex = 0;

        const animate = () => {
            if (currentIndex >= text.length) {
                setIsAnimating(false);
                return;
            }

            animateLetter(currentIndex);
            currentIndex++;
            setTimeout(animate, letterInterval);
        };

        animate();
    }, [animateLetter, text, isAnimating, letterInterval]);

    useEffect(() => {
        const timer = setTimeout(startAnimation, initialDelay);
        return () => clearTimeout(timer);
    }, []);

    const motionVariants = useMemo(
        () => ({
            matrix: {
                color: "#00ff00",
                textShadow: "0 2px 4px rgba(0, 255, 0, 0.5)",
            },
        }),
        []
    );

    return (
        <div
            className={cn(
                "flex items-center text-black dark:text-white",
                className
            )}
            aria-label="Matrix text animation"
        >
            <div className="flex items-center">
                <div className="flex flex-wrap items-center">
                    {letters.map((letter, index) => (
                        <motion.span
                            key={`${index}-${letter.char}`}
                            className={cn(
                                "font-mono text-4xl md:text-6xl w-[1ch] text-center inline-block overflow-hidden",
                                letterClassName
                            )}
                            initial="initial"
                            animate={letter.isMatrix ? "matrix" : "normal"}
                            variants={motionVariants}
                            transition={{
                                duration: 0.1,
                                ease: "easeInOut",
                            }}
                            style={{
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {letter.isSpace ? " " : letter.char}
                        </motion.span>
                    ))}
                </div>
            </div>
        </div>
    );
};
