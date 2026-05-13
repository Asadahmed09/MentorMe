import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const { user, mentorProfile, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || mentorProfile?.phone || "",
    whatsapp_number: user?.whatsapp_number || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
    website_url: user?.website_url || "",
    show_email: mentorProfile?.show_email ?? true,
    show_phone: mentorProfile?.show_phone ?? true,
    contact_visibility:
      mentorProfile?.contact_visibility || ("accepted_only" as const),
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || mentorProfile?.phone || "",
      whatsapp_number: user?.whatsapp_number || "",
      linkedin_url: user?.linkedin_url || "",
      github_url: user?.github_url || "",
      website_url: user?.website_url || "",
      show_email: mentorProfile?.show_email ?? true,
      show_phone: mentorProfile?.show_phone ?? true,
      contact_visibility:
        mentorProfile?.contact_visibility || ("accepted_only" as const),
    });
  }, [user, mentorProfile]);

  const setField = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || mentorProfile?.phone || "",
      whatsapp_number: user?.whatsapp_number || "",
      linkedin_url: user?.linkedin_url || "",
      github_url: user?.github_url || "",
      website_url: user?.website_url || "",
      show_email: mentorProfile?.show_email ?? true,
      show_phone: mentorProfile?.show_phone ?? true,
      contact_visibility:
        mentorProfile?.contact_visibility || ("accepted_only" as const),
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-3xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-white/80">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {/* Name */}
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            disabled={!isEditing}
            leftIcon={<UserIcon className="w-5 h-5" />}
          />

          {/* Email (always disabled) */}
          <Input
            label="Email"
            value={user?.email || ""}
            disabled
            leftIcon={<EnvelopeIcon className="w-5 h-5" />}
            className="bg-gray-50 text-gray-500"
          />

          {/* University (read only) */}
          <Input
            label="University"
            value={user?.univeristy || "—"}
            disabled
            className="bg-gray-50 text-gray-500"
          />

          {/* Role (read only) */}
          <Input
            label="Role"
            value={user?.role || ""}
            disabled
            className="bg-gray-50 text-gray-500 capitalize"
          />

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Contact & Social Links
              </h3>
              <p className="text-sm text-gray-600">
                Add details now or update them later. Mentor phone changes are
                also synced with the mentor profile.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                disabled={!isEditing}
                leftIcon={<PhoneIcon className="w-5 h-5" />}
                placeholder="+92 300 1234567"
              />

              <Input
                label="WhatsApp"
                value={form.whatsapp_number}
                onChange={(e) => setField("whatsapp_number", e.target.value)}
                disabled={!isEditing}
                leftIcon={<PhoneIcon className="w-5 h-5" />}
                placeholder="WhatsApp number"
              />

              <Input
                label="LinkedIn"
                value={form.linkedin_url}
                onChange={(e) => setField("linkedin_url", e.target.value)}
                disabled={!isEditing}
                leftIcon={<LinkIcon className="w-5 h-5" />}
                placeholder="https://linkedin.com/in/your-profile"
              />

              <Input
                label="GitHub"
                value={form.github_url}
                onChange={(e) => setField("github_url", e.target.value)}
                disabled={!isEditing}
                leftIcon={<LinkIcon className="w-5 h-5" />}
                placeholder="https://github.com/your-handle"
              />

              <Input
                label="Website / Portfolio"
                value={form.website_url}
                onChange={(e) => setField("website_url", e.target.value)}
                disabled={!isEditing}
                leftIcon={<GlobeAltIcon className="w-5 h-5" />}
                placeholder="https://your-site.com"
                className="md:col-span-2"
              />
            </div>

            {user?.role === "mentor" && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Contact visibility for students
                </h4>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.show_email}
                      onChange={(e) => setField("show_email", e.target.checked)}
                      disabled={!isEditing}
                    />
                    Show email
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.show_phone}
                      onChange={(e) => setField("show_phone", e.target.checked)}
                      disabled={!isEditing}
                    />
                    Show phone
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact access
                  </label>
                  <select
                    value={form.contact_visibility}
                    onChange={(e) =>
                      setField("contact_visibility", e.target.value as any)
                    }
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900"
                  >
                    <option value="public">Public</option>
                    <option value="accepted_only">Accepted only</option>
                    <option value="none">Hidden</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} isLoading={isSaving}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
