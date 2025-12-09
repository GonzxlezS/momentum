import { useRef, useState } from "react";
import type { CountdownData } from "../../core/models/countdown.ts";
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

import styles from "./CountdownForm.module.css";

type CountdownFormProps = {
  data?: CountdownData;
  onSave: (data: CountdownData) => void;
  onUpdate: (data: CountdownData) => void;
  onDelete: (id: number) => void;
  onDiscard: () => void;
};

const defaultCountdownData: CountdownData = {
  name: "",
  date: new Date(NaN),
  emoji: "🤟",
  color: "#50533C",
};

function CountdownForm(props: CountdownFormProps) {
  const { data, onSave, onUpdate, onDelete, onDiscard } = props;

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CountdownData>(
    data || defaultCountdownData,
  );

  const isEditing = !!formData.id;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setFormData((prevData) => ({
      ...prevData,
      emoji: emojiData.emoji,
    }));

    if (emojiPickerRef.current) {
      emojiPickerRef.current.hidePopover();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedValue: string | Date = value;

      if (name === "date" && value != "") {
        updatedValue = new Date(value);
      }

      return {
        ...prevData,
        [name]: updatedValue,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      onUpdate(formData);
    } else {
      onSave(formData);
    }

    setFormData(defaultCountdownData);
  };

  const handleDeleteClick = () => {
    if (formData.id) {
      onDelete(formData.id);
    }
  };

  const handleDiscardClick = () => {
    onDiscard();
  };

  return (
    <form
      id="countdownForm"
      className={styles.countdownForm}
      onSubmit={handleSubmit}
    >
      <div
        id="emojiPickerPopover"
        className={styles.emojiPickerPopover}
        popover="auto"
        ref={emojiPickerRef}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          theme={Theme.AUTO}
          emojiStyle={EmojiStyle.NATIVE}
          autoFocusSearch={false}
          lazyLoadEmojis={false}
          previewConfig={{ showPreview: false }}
        />
      </div>

      <div id="emojiColorContainer" className={styles.emojiColorContainer}>
        <button
          type="button"
          className={styles.emojiBtn}
          popoverTarget="emojiPickerPopover"
          popoverTargetAction="show"
        >
          {formData.emoji}
        </button>

        <input
          type="color"
          id="color"
          className={styles.colorPicker}
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
        />
      </div>

      <label htmlFor="name" className={styles.formLabel}>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.formInput}
          placeholder=" "
          required
        />
        <span className={styles.formText}>Name</span>
      </label>

      <label htmlFor="date" className={styles.formLabel}>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date instanceof Date &&
              !isNaN(formData.date.getTime())
            ? formData.date.toISOString().slice(0, 10)
            : ""}
          onChange={handleChange}
          className={styles.formInput}
          required
        />
        <span className={styles.formText}>Date</span>
      </label>

      <div className={styles.btnContainer}>
        <button
          id="discardBtn"
          className={styles.discardBtn}
          type="reset"
          form="countdownForm"
          onClick={handleDiscardClick}
        >
          Discard
        </button>

        {isEditing && (
          <button
            id="deleteBtn"
            className={styles.deleteBtn}
            type="reset"
            form="countdownForm"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}

        <button
          id={isEditing ? "updateBtn" : "saveBtn"}
          className={isEditing ? styles.updateBtn : styles.saveBtn}
          type="submit"
          form="countdownForm"
        >
          {isEditing ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default CountdownForm;
