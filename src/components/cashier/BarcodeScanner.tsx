"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = { onScan: (code: string) => void };

export default function BarcodeScanner({ onScan }: Props) {
    const lastScan = useRef<{ code: string; at: number }>({ code: "", at: 0 });
    const onScanRef = useRef(onScan);
    
    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    useEffect(() => {
        const scanner = new Html5Qrcode("barcode-reader");

        scanner
            .start(
                { facingMode: "environment" }, // kamera belakang
                { fps: 10, qrbox: { width: 260, height: 140 } },
                (code) => {
                    // Cegah satu barcode terbaca berkali-kali dalam 1,5 detik
                    const now = Date.now();
                    if (code === lastScan.current.code && now - lastScan.current.at < 1500) return;
                    lastScan.current = { code, at: now };
                    onScanRef.current(code);
                },
                () => { }
            )
            .catch(() => {
                /* izin kamera ditolak; tampilkan input manual sebagai cadangan */
            });

        return () => {
            scanner.isScanning ? scanner.stop().catch(() => { }) : undefined;
        };
    }, []);

    return (
        <div
            id="barcode-reader"
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"
        />
    );
}