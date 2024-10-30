<template>
    <div class="autocomplete">
        <input
            v-model="query"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp"
            @keydown.enter.prevent="onEnter"
            @keydown.esc.prevent="onEsc"
            ref="inputElement"
            type="text"
            placeholder="Search users..."
        />
        <teleport to="body">
            <ul
                v-if="computedShowSuggestions && suggestions.length"
                :style="suggestionStyle"
                ref="suggestionList"
                class="suggestion-list"
            >
                <li
                    v-for="(suggestion, index) in suggestions"
                    :key="index"
                    :class="{ highlighted: index === highlightedIndex }"
                    @mousedown.prevent="selectSuggestion(suggestion.name)"
                    @mouseover="onMouseOver(index)"
                    class="suggestion-item"
                >
                    {{ suggestion.name }}
                </li>
            </ul>
        </teleport>
    </div>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            query: '',
            suggestions: [],
            showSuggestions: false,
            suggestionStyle: {},
            debounceTimeout: null,
            highlightedIndex: -1, // Tracks the currently highlighted suggestion
        };
    },
    computed: {
        computedShowSuggestions() {
            return this.isOpen && this.showSuggestions;
        },
    },
    methods: {
        onInput() {
            this.showSuggestions = true;
            this.highlightedIndex = -1; // Reset highlight on input
            this.debounceFetchSuggestions();
            this.updateSuggestionPosition();
        },
        onFocus() {
            if (this.isOpen) {
                this.showSuggestions = true;
                this.fetchSuggestions();
                this.updateSuggestionPosition();
            }
        },
        onArrowDown() {
            if (this.highlightedIndex < this.suggestions.length - 1) {
                this.highlightedIndex++;
                this.scrollToHighlightedItem();
            }
        },
        onArrowUp() {
            if (this.highlightedIndex > 0) {
                this.highlightedIndex--;
                this.scrollToHighlightedItem();
            }
        },
        onEnter() {
            if (this.highlightedIndex !== -1) {
                this.selectSuggestion(this.suggestions[this.highlightedIndex].name);
            }
        },
        onEsc() {
            this.showSuggestions = false;
        },
        onMouseOver(index) {
            this.highlightedIndex = index;
        },
        debounceFetchSuggestions() {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.fetchSuggestions();
            }, 300);
        },
        fetchSuggestions() {
            fetch(`https://jsonplaceholder.typicode.com/users`)
                .then((response) => response.json())
                .then((data) => {
                    this.suggestions = data.filter((user) =>
                        user.name.toLowerCase().includes(this.query.toLowerCase()),
                    );
                    this.updateSuggestionPosition();
                });
        },
        selectSuggestion(suggestion) {
            this.query = suggestion;
            this.showSuggestions = false;
            this.suggestions = [];
            this.$emit('select', suggestion);
        },
        onBlur() {
            setTimeout(() => {
                this.showSuggestions = false;
            }, 200);
        },
        updateSuggestionPosition() {
            const inputRect = this.$refs.inputElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const spaceBelow = windowHeight - inputRect.bottom;
            const spaceAbove = inputRect.top;

            if (spaceBelow < 200 && spaceAbove > 200) {
                this.suggestionStyle = {
                    position: 'fixed',
                    bottom: `${windowHeight - inputRect.top}px`,
                    left: `${inputRect.left}px`,
                    width: `${inputRect.width}px`,
                    zIndex: 9999,
                };
            } else {
                this.suggestionStyle = {
                    position: 'fixed',
                    top: `${inputRect.bottom}px`,
                    left: `${inputRect.left}px`,
                    width: `${inputRect.width}px`,
                    zIndex: 9999,
                };
            }
        },
        scrollToHighlightedItem() {
            const suggestionList = this.$refs.suggestionList;
            const highlightedItem = suggestionList.children[this.highlightedIndex];

            if (highlightedItem) {
                const itemTop = highlightedItem.offsetTop;
                const itemBottom = itemTop + highlightedItem.offsetHeight;
                const listScrollTop = suggestionList.scrollTop;
                const listHeight = suggestionList.clientHeight;

                if (itemBottom > listScrollTop + listHeight) {
                    suggestionList.scrollTop = itemBottom - listHeight;
                } else if (itemTop < listScrollTop) {
                    suggestionList.scrollTop = itemTop;
                }
            }
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateSuggestionPosition);
        window.addEventListener('scroll', this.updateSuggestionPosition, true);
    },
    unmounted() {
        window.removeEventListener('resize', this.updateSuggestionPosition);
        window.removeEventListener('scroll', this.updateSuggestionPosition, true);
    },
};
</script>

<style scoped>
.autocomplete {
    position: relative;
    width: 100%;
}

input[type='text'] {
    width: 100%;
    box-sizing: border-box;
}

.suggestion-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item.highlighted {
    background-color: #f0f0f0;
}
</style>
