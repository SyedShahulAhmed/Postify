import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export const RTE = ({ name, control, label, defaultValue = "" }) => {
  return (
    <div className="w-full ">
      {label && <label className="inline-block mb-2 pl-1">{label}</label>}
      <Controller
        name={name || "Content"}
        control={control}
        defaultValue={defaultValue} // Ensure default value is set
        render={({ field: { onChange, value } }) => (
          <Editor
        apiKey= {import.meta.env.VITE_TINYMCE_KEY}
            value={value} // Controlled input
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Raleway,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
};
