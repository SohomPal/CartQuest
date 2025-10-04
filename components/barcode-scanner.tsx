"use client"

import { useState, useEffect } from "react"
import { Camera, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BarcodeScannerProps {
  open: boolean
  onClose: () => void
  onScan: () => void
  itemName: string
}

export function BarcodeScanner({ open, onClose, onScan, itemName }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (open) {
      setScanning(true)
      // Simulate barcode scan after 2 seconds
      const timer = setTimeout(() => {
        setScanning(false)
        onScan()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [open, onScan])

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
                <p className="text-lg font-medium">Scanning {itemName}...</p>
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

          <p className="text-sm text-muted-foreground text-center">Position the barcode within the frame to scan</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
