import React, {ChangeEventHandler} from 'react';

export type FilterBarProps = {
    handleInputChange: ChangeEventHandler;
};

export default function FilterBar({handleInputChange}: FilterBarProps) {
    return (
        <form className="mb-4">
            <div className="form-group row">
                <label htmlFor="name" className="col-form-label col-sm-2">
                    Name:
                </label>
                <div className="col-sm-10">
                    <input
                        id="name"
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </form>
    );
}
