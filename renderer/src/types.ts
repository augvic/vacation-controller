declare global {
    interface Window {
        api: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
            createUser: (data: { user: string, admission: string }) => { success: boolean, message: string };
            getUsers: () => { success: boolean, message: string, data: [{ id: number, user: string, admission: string, status: string, daysLeft: string }] };
            deleteUser: (data: { id: number, user: string }) => { success: boolean, message: string };
            createVacation: (data: { userId: number, user: string, begin: string, end: string }) => { success: boolean, message: string, data: { status: string, daysLeft: string } };
            getVacations: (data: { userId: number }) => { success: boolean, message: string, data: [{ id: number, userId: string, begin: string, end: string }] };
            deleteVacation: (data: { id: number }) => { success: boolean, message: string; data: { status: string, daysLeft: string } };
        }
    }
}

export {};
