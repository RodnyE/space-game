class Inventory {
    constructor(inventory, limit) {
        this.inventory = inventory;
        this.limit = limit || 10;
        this.blocked = false;
    }

    // Set a new inventory limit
    setLimit(limit) {
        this.limit = limit;
    }

    // Set the inventory block state
    setBlock(block) {
        this.blocked = block || false;
    }

    // Return the inventory
    getInventory(){
        return this.inventory;
    }

    // Add an item to the inventory by ID and quantity
    addItem(id, quantity) {
        if (this.blocked) {
            return { message: "INVENTORY_BLOCKED" };
        }

        // Check if an item with the same ID already exists in the inventory
        const existingItem = this.inventory.find((item) => item.id === id);

        if (existingItem) {
            // If the item already exists, increase its quantity
            existingItem.quantity += quantity;
            return this.inventory;
        } else if (this.inventory.length < this.limit) {
            // If the item doesn't exist and there is space in the inventory, add it
            this.inventory.push({ id, quantity: quantity || 1 });
            return this.inventory;
        } else {
            // If there's no space available, return a message indicating so
            return { message: "NO_SPACE_AVAILABLE" };
        }
    }

    // Remove an item from the inventory by ID and quantity
    removeItem(id, quantity) {
        if (this.blocked) {
            return { message: "INVENTORY_BLOCKED" };
        }

        // Find the index of the item with the provided ID
        const existingItemIndex = this.inventory.findIndex((item) => item.id == id);

        if (existingItemIndex !== -1) {
            // Get the item at the found index
            const existingItem = this.inventory[existingItemIndex];

            if (quantity === undefined) {
                // If no specific quantity is provided, set the quantity to 0 (remove the item)
                this.inventory[existingItemIndex].quantity = 0;
            } else if (quantity > existingItem.quantity) {
                // If the requested quantity is more than what's available, return an error message
                return { message: "NO_ENOUGH_ITEMS" };
            } else {
                // Decrease the item's quantity by the specified amount
                this.inventory[existingItemIndex].quantity -= quantity;
            }

            if (this.inventory[existingItemIndex].quantity == 0) {
                // If the quantity reaches 0, remove the item from the inventory
                this.inventory.splice(existingItemIndex, 1);
            }
        } else {
            // If the item with the provided ID is not found, return an error message
            return { message: "ITEM_NOT_FOUND" };
        }

        return this.inventory;
    }

    // Move an item from the source index to the destination index
    moveItem(sourceIndex, destinationIndex) {
        if (this.blocked) {
            return { message: "INVENTORY_BLOCKED" };
        }

        // Check if the source and destination indices are within the allowed range
        if (
            sourceIndex < 0 || sourceIndex >= this.limit ||
            destinationIndex < 0 || destinationIndex >= this.limit
        ) {
            // If indices are out of range, return an error message
            return { message: "INDEX_OUT_OF_RANGE" };
        }

        // Check if there is an item at the source index
        const sourceItem = this.inventory[sourceIndex];
        if (!sourceItem) {
            // If the source index is empty, return an error message
            return { message: "SOURCE_INDEX_EMPTY" };
        }

        // Check if the destination index is empty or contains an item with the same ID
        const destinationItem = this.inventory[destinationIndex];
        if (!destinationItem) {
            // If the destination index is empty, perform the move
            this.inventory[sourceIndex] = null; // Mark the source index as empty
            this.inventory[destinationIndex] = sourceItem;
        } else if (destinationItem.id === sourceItem.id) {
            // If the destination index contains an item with the same ID, perform a swap
            this.inventory[sourceIndex] = destinationItem;
            this.inventory[destinationIndex] = sourceItem;
        } else {
            // If the destination index is occupied, return an error message
            return { message: "DESTINATION_INDEX_OCCUPIED" };
        }

        return this.inventory;
    }
}

module.exports = Inventory;