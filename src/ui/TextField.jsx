
export default function TextField ( {
    placeholder, 
    onInput, 
    type, 
    value
}) {
    return (
        <div className="m-1">
            <input
                className="form-control bg-light"
                type={type}
                value={value}
                placeholder={placeholder}
                onInput={onInput}
            />
        </div>
    );
}