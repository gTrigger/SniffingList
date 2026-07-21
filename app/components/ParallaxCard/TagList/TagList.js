"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./TagList.module.scss";

export default function TagList({ items }) {
    const containerRef = useRef(null);
    const [hideDots, setHideDots] = useState(new Set());

    useEffect(() => {
        const calculateDots = () => {
            if (!containerRef.current) return;
            const children = Array.from(containerRef.current.children);
            const newHideDots = new Set();

            for (let i = 0; i < children.length - 1; i++) {
                const current = children[i];
                const next = children[i + 1];

                if (next.offsetTop > current.offsetTop + 5) {
                    newHideDots.add(i);
                }
            }

            newHideDots.add(children.length - 1);

            setHideDots(prev => {
                if (prev.size === newHideDots.size && [...prev].every(val => newHideDots.has(val))) {
                    return prev;
                }
                return newHideDots;
            });
        };

        calculateDots();

        const observer = new ResizeObserver(() => {
            window.requestAnimationFrame(calculateDots);
        });

        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [items]);

    if (!items || items.length === 0) return null;

    return (
        <div ref={containerRef} className={styles.container}>
            {items.map((item, index) => (
                <span key={index} className={styles.itemWrapper}>
                    <span className={styles.text}>{item}</span>
                    <span
                        className={styles.dot}
                        style={{
                            opacity: hideDots.has(index) ? 0 : 1,
                            pointerEvents: hideDots.has(index) ? 'none' : 'auto'
                        }}
                    >
                        •
                    </span>
                </span>
            ))}
        </div>
    );
}