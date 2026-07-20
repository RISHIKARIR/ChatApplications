import React, { useContext, useMemo, useState } from "react";
import { X, Pencil, Camera, Trash2, Check } from "lucide-react";
import { useImageUpload } from "../../hooks/usePreviewImage";
import { Apifetch } from "../../lib/apifetch";
import { userAuthContext } from "../context/authContext";

function GroupDrawer({ open, setOpen, data }) {
  const { preview, file, uploadRef, previewImage, removeImage } =
    useImageUpload(data.group_table?.Group_image);
  const { user } = useContext(userAuthContext);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(data.group_table.Group_name || "");
  const [description, setDescription] = useState(
    data.group_table.Group_Description || "",
  );

  console.log(data, "inrfirkfrom");

  const [saving, setSaving] = useState(false);

  const role = useMemo(() => {
    const currentUser = data.user_members.find(
      (Member) => Member.id == user.id,
    );

    return currentUser.conversation_members_table.role;
  }, [data]);

  console.log(role, "lfhuygfhf");

  function enterEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setName(data?.group_table?.Group_name || "");
    setDescription(data.group_table?.Group_Description || "");
    removeImage();
    setEditing(false);
  }

  async function handleSave() {
    if (saving) return;
    try {
      setSaving(true);

      const res = await Apifetch("");

      setEditing(false);
    } catch (err) {
      console.error("Failed to save group:", err);
    } finally {
      setSaving(false);
    }
  }

  console.log(data, "iofjoifjioj");
  return (
    <div
      onClick={() => setOpen(false)}
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed right-0 top-0 z-50 flex h-screen w-105 flex-col border-l border-white/10 bg-[#111815] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <span className="text-[13px] font-medium uppercase tracking-wide text-white/40">
            Group info
          </span>

          {role == "ADMIN" ? (
            <div className="flex items-center gap-3">
              {!editing ? (
                <button
                  onClick={enterEdit}
                  className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              ) : (
                <button
                  onClick={cancelEdit}
                  className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
                >
                  Cancel
                </button>
              )}
              <span
                onClick={() => setOpen(false)}
                className="cursor-pointer text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </span>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ${
                  editing ? "ring-white/20" : "ring-white/[0.06]"
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="group"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#2b2934] text-2xl font-semibold text-white/70">
                    {name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {editing && (
                <button
                  onClick={() => {
                    uploadRef.current.click();
                  }}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-white/90"
                >
                  <Camera size={13} />
                </button>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={uploadRef}
              onChange={previewImage}
              className="hidden"
            />

            {editing && preview && (
              <button
                onClick={removeImage}
                className="mt-2 flex items-center gap-1 text-[12px] text-white/35 hover:text-red-400/80 transition-colors"
              >
                <Trash2 size={11} />
                Remove photo
              </button>
            )}
          </div>

          {/* name */}
          <div className="mt-6">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-white/30">
              Name
            </p>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-white/15 bg-transparent pb-1.5 text-[15px] text-white outline-none focus:border-white/40"
                placeholder="Group name"
                autoFocus
              />
            ) : (
              <p className="text-[15px] text-white">{name || "—"}</p>
            )}
          </div>

          {/* description */}
          <div className="mt-5">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-white/30">
              Description
            </p>
            {editing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none border-b border-white/15 bg-transparent pb-1.5 text-[14px] leading-relaxed text-white/80 outline-none focus:border-white/40"
                placeholder="Add a description"
              />
            ) : (
              <p className="text-[14px] leading-relaxed text-white/60">
                {description || "No description yet."}
              </p>
            )}
          </div>

          {/* members */}
          <div className="mt-7">
            <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wide text-white/30">
              Members · {data.user_members.length}
            </p>
            <div className="flex flex-col gap-0.5">
              {data.user_members.map((member, index) => (
                <div
                  key={member.id ?? index}
                  className="flex items-center text-white/85 gap-3 rounded-lg px-2 py-2 hover:bg-white/4 transition-colors"
                >
                  {member.Profile_img ? (
                    <img
                      src={member.Profile_img}
                      className="h-8 w-8 rounded-2xl"
                    ></img>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[13px] font-medium text-white/70">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span>
                    {member.name}
                  </span>

                  <span className="text-gray-500 text-xs">
                  {member.conversation_members_table.role}
                  </span>


                </div>
              ))}
            </div>
          </div>
        </div>

        {/* save bar — only in edit mode */}
        {editing && (
          <div className="border-t border-white/[0.06] px-5 py-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-[14px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Check size={15} />
                  Save changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupDrawer;
