import { post } from "@/lib/axios/client";
import type { GenerateQrDto, QrCodeDao } from "@/lib/types/api";

export const generateQrCode = (data: GenerateQrDto): Promise<QrCodeDao> =>
	post<QrCodeDao, GenerateQrDto>("/qr/generate", data);
