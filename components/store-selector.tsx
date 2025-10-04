"use client"

import { useState } from "react"
import { Search, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { stores, type Store } from "@/lib/stores"
import { useStore } from "@/lib/store-context"

interface StoreSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StoreSelector({ open, onOpenChange }: StoreSelectorProps) {
  const { currentStore, setCurrentStore } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectStore = (store: Store) => {
    setCurrentStore(store)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Select Your Store</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredStores.map((store) => (
              <Button
                key={store.id}
                variant={currentStore.id === store.id ? "default" : "outline"}
                className="w-full justify-between h-auto py-4"
                onClick={() => handleSelectStore(store)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{store.logo}</span>
                  <span className="font-semibold text-lg">{store.name}</span>
                </div>
                {currentStore.id === store.id && <Check className="h-5 w-5" />}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
