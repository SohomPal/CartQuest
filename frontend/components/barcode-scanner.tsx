"use client"

import { useState, useEffect } from "react"
import { Camera, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BarcodeScannerProps {
  open: boolean
  onClose: () => void
  onScan: () => void
  itemName: string
  itemPoints: number
}

export function BarcodeScanner({ open, onClose, onScan, itemName, itemPoints }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState("")

  useEffect(() => {
    if (open) {
      setScanning(false)
      setBarcodeInput("")
    }
  }, [open])

  const handleSimulateScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      onScan()
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Scan Barcode</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Camera View Simulation */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <Camera className="h-16 w-16 mx-auto animate-pulse" />
                <p className="text-lg font-medium">{itemName}</p>
                <p className="text-sm text-gray-400">+{itemPoints} pts</p>
                {scanning && (
                  <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-green-500 animate-scan-line" />
                  </div>
                )}
              </div>
            </div>

            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full h-48 border-4 border-green-500 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Enter barcode manually..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="text-center font-mono"
            />
            <Button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="w-full bg-gradient-to-r from-[var(--store-gradient-from)] to-[var(--store-gradient-to)] text-white"
              size="lg"
            >
              {scanning ? "Scanning..." : "Simulate Scan"}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Position the barcode within the frame or use simulate scan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
