class Shortcuts {
    constructor(shortcuts) {
        this.shortcuts = shortcuts || [];
        this.longitude = 10;
    }

    // Function to add a shortcut to the list
    addShortcut(newShortcut , index) {
        if (index < this.longitude) {
            this.shortcuts[index] = newShortcut;
        } else {
            console.error('Cannot add more shortcuts. Maximum length reached.');
        }
    }

    // Function to delete a shortcut based on its index
    deleteShortcut(index) {
        if (index >= 0 && index < this.shortcuts.length) {
            this.shortcuts.splice(index, 1);
        } else {
            console.error('Invalid index. Index should be within the range of existing shortcuts.');
        }
    }

    // Function to exchange shortcuts based on startIndex and endIndex
    exchangeShortcuts(startIndex, endIndex) {
        if (startIndex >= 0 && startIndex < this.shortcuts.length &&
            endIndex >= 0 && endIndex < this.shortcuts.length) {
            // Swap values using destructuring assignment
            [this.shortcuts[startIndex], this.shortcuts[endIndex]] = [this.shortcuts[endIndex], this.shortcuts[startIndex]];
        } else {
            console.error('Invalid index. Both startIndex and endIndex should be within the range of existing shortcuts.');
        }
    }

    // Function to get a shortcut based on its index
    getShortcut(index) {
        if (index >= 0 && index < this.shortcuts.length) {
            return this.shortcuts[index];
        } else {
            console.error('Invalid index. Index should be within the range of existing shortcuts.');
            return null;
        }
    }

}

module.exports = Shortcuts;