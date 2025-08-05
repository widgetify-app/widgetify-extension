import { getFromStorage, setToStorage } from "@/common/storage";
import { listenEvent } from "@/common/utils/call-event";
import Tooltip from "@/components/toolTip";
import { useGeneralSetting } from "@/context/general-setting.context";
import { useWidgetVisibility } from "@/context/widget-visibility.context";
import { getConfigData } from "@/services/config-data/config_data-api";
import { type JSX, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TbApps } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { SettingModal } from "../setting/setting-modal";
import { FriendsList } from "./friends-list/friends";
import { ProfileNav } from "./profile/profile";
import { SyncButton } from "./sync/sync";

export interface PageLink {
	name: string;
	to: string;
}

export function NavbarLayout(): JSX.Element {
	const [showSettings, setShowSettings] = useState(false);
	const { openWidgetSettings } = useWidgetVisibility();
	const { blurMode, updateSetting } = useGeneralSetting();
	const [tab, setTab] = useState<string | null>(null);

	const [logoData, setLogoData] = useState<{
		logoUrl: string | null;
		content: string | null;
	}>({
		logoUrl: null,
		content: '<h1 class="text-xl text-gray-100">ویجتی‌فای</h1>',
	});

	useEffect(() => {
		const handleOpenSettings = (tab: any) => {
			if (tab) {
				setTab(tab);
			}
			setShowSettings(true);
		};

		const loadConfig = async () => {
			try {
				const storeData = await getFromStorage("configData");
				if (storeData) {
					setLogoData({
						content: storeData.logo?.content,
						logoUrl: storeData.logo?.url,
					});
				}

				const data = await getConfigData();
				if (data.logo) {
					if (
						(storeData?.logo && storeData.logo.id !== data.logo.id) ||
						!storeData?.logo
					) {
						setLogoData({
							content: data.logo.content,
							logoUrl: data.logo.url,
						});

						await setToStorage("configData", {
							...storeData,
							logo: {
								id: data.logo.id,
								content: data.logo.content,
								url: data.logo.url,
							},
						});
					}
				}
			} catch {}
		};

		const openSettingEvent = listenEvent("openSettings", handleOpenSettings);
		loadConfig();
		return () => {
			openSettingEvent();
		};
	}, []);

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode;
		updateSetting("blurMode", newBlurMode);
	};

	return (
		<>
			<nav className="flex items-center justify-between px-4 mt-0.5 md:mt-1.5">
				<div className="flex items-center gap-0.5">
					<a
						href="https://widgetify.ir"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2"
					>
						{logoData.logoUrl && (
							<img
								src={logoData.logoUrl}
								alt={logoData.content || "ویجتی‌فای"}
								className="w-6 h-6 rounded-full"
							/>
						)}
						{logoData.content && (
							<div
								className="leading-relaxed"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
								dangerouslySetInnerHTML={{
									__html: logoData.content,
								}}
							/>
						)}
					</a>
				</div>
				<div className="flex items-center gap-1">
					<Tooltip content={blurMode ? "نمایش" : "مخفی"}>
						<div
							className="flex items-center w-8 h-8 gap-2 px-2 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80"
							onClick={handleBlurModeToggle}
						>
							{blurMode ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
						</div>
					</Tooltip>
					<FriendsList />
					<ProfileNav />
					<SyncButton />
					<Tooltip content="مدیریت ویجت‌ها">
						<div
							className="flex items-center w-8 h-8 gap-2 px-2 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80"
							onClick={() => openWidgetSettings()}
						>
							<TbApps size={18} className="text-muted" />
						</div>
					</Tooltip>
					<Tooltip content="تنظیمات">
						<div
							className="flex items-center w-8 h-8 gap-2 px-2 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80"
							onClick={() => setShowSettings(true)}
						>
							<VscSettings size={18} className="text-muted" />
						</div>
					</Tooltip>
				</div>
			</nav>
			<SettingModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				selectedTab={tab}
			/>
		</>
	);
}
