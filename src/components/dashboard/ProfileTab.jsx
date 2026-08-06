import {
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaShieldAlt,
} from "react-icons/fa";
import styles from "../../pages/DashboardPage.module.css";

export default function ProfileTab({
    user,
    profileForm,
    setProfileForm,
    avatarPresets,
    onSaveProfile,
}) {
    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2>تنظیمات حساب کاربری و امنیت</h2>
                <p>ویرایش مشخصات شخصی و انتخاب تصویر آواتار</p>
            </div>

            <form onSubmit={onSaveProfile} className={styles.profileFormGrid}>
                <div className={styles.fullWidthGroup}>
                    <label>انتخاب تصویر آواتار حساب:</label>
                    <div className={styles.avatarPresets}>
                        {avatarPresets.map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`Avatar ${i}`}
                                className={`${styles.presetImg} ${profileForm.avatar === url ? styles.presetSelected : ""
                                    }`}
                                onClick={() => setProfileForm({ ...profileForm, avatar: url })}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="pf-name">نام و نام خانوادگی:</label>
                    <div className={styles.inputIconWrapper}>
                        <FaUser className={styles.fIcon} />
                        <input
                            id="pf-name"
                            type="text"
                            value={profileForm.name}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, name: e.target.value })
                            }
                            placeholder="مثال: بهراد هاشمی"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="pf-email">آدرس پست الکترونیکی:</label>
                    <div className={styles.inputIconWrapper}>
                        <FaEnvelope className={styles.fIcon} />
                        <input
                            id="pf-email"
                            type="email"
                            dir="ltr"
                            value={profileForm.email}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="pf-loc">شهر / استان محل سکونت:</label>
                    <div className={styles.inputIconWrapper}>
                        <FaMapMarkerAlt className={styles.fIcon} />
                        <input
                            id="pf-loc"
                            type="text"
                            value={profileForm.location}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, location: e.target.value })
                            }
                            placeholder="تهران، ایران"
                        />
                    </div>
                </div>

                <div className={styles.fullWidthGroup}>
                    <label htmlFor="pf-bio">درباره شما (بیوگرافی):</label>
                    <textarea
                        id="pf-bio"
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) =>
                            setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                        placeholder="توضیحات کوتاه درباره تخصص یا پروژه‌هایتان..."
                    />
                </div>

                <div className={styles.fullWidthGroup}>
                    <button type="submit" className={styles.saveProfileBtn}>
                        <FaCheckCircle />
                        <span>ذخیره تغییرات حساب</span>
                    </button>
                </div>
            </form>

            <div className={styles.securityBox}>
                <h3 className={styles.subTitle}>وضعیت امنیت و نشست‌های فعال</h3>
                <div className={styles.secRows}>
                    <div className={styles.secRow}>
                        <div className={styles.secLabel}>
                            <FaShieldAlt className={styles.secIcon} />
                            <div>
                                <strong>روش احراز هویت:</strong>
                                <p>ورود امن فایربیس با ایمیل ({user?.email})</p>
                            </div>
                        </div>
                        <span className={styles.activePill}>فعال و ایمن</span>
                    </div>
                </div>
            </div>
        </div>
    );
}