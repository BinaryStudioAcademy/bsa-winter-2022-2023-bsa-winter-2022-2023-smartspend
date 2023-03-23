import { WalletEntity } from '~/bundles/wallets/wallets.entity.js';
import { type WalletRepository } from '~/bundles/wallets/wallets.repository.js';
import { type IService } from '~/common/interfaces/interfaces.js';

import { WalletValidationMessage } from './enums/enums.js';
import {
    type WalletCreateRequestDto,
    type WalletFindRequestDto,
    type WalletGetAllItemResponseDto,
    type WalletGetAllResponseDto,
} from './types/types.js';

class WalletService implements Partial<IService> {
    private walletRepository: WalletRepository;

    public constructor(walletRepository: WalletRepository) {
        this.walletRepository = walletRepository;
    }

    public async find(
        payload: WalletFindRequestDto,
    ): Promise<WalletEntity | undefined> {
        return await this.walletRepository.find(payload.id);
    }

    public async findAll(): Promise<WalletGetAllResponseDto> {
        const items = await this.walletRepository.findAll();

        return {
            items: items.map((it) => it.toObject()),
        };
    }

    public async newCreate(
        payload: WalletCreateRequestDto,
        userId: string,
    ): Promise<WalletGetAllItemResponseDto> {
        const wallet = await this.walletRepository.newCreate(
            WalletEntity.initializeNew({
                name: payload.name,
                currencyId: payload.currencyId,
                balance: payload.balance,
                ownerId: userId,
            }),
        );

        return wallet.toObject();
    }

    public async newUpdate(
        id: string,
        payload: WalletCreateRequestDto,
        userId: string,
    ): Promise<WalletGetAllItemResponseDto | undefined> {
        const newWallet = await this.walletRepository.newUpdate(
            id,
            payload,
            userId,
        );

        if (!newWallet) {
            throw new Error(WalletValidationMessage.WALLET_NOT_FOUND);
        }

        return newWallet.toObject();
    }

    public async newDelete(
        id: string,
        ownerId: string,
    ): Promise<WalletGetAllResponseDto | undefined> {
        const deletedWallet = await this.walletRepository.newDelete(
            id,
            ownerId,
        );

        if (!deletedWallet) {
            throw new Error(WalletValidationMessage.WALLET_NOT_FOUND);
        }
        return await this.findAll();
    }
}

export { WalletService };
