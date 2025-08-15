"use strict";
class Member {
    constructor(name, contact) {
        this.memberId = Member.nextId++;
        this.name = name;
        this.contact = contact;
        this.borrowedItems = [];
    }
    getDetails() {
        return `ID: ${this.memberId}, Name: ${this.name}, Contact: ${this.contact}, Borrowed Items: ${this.borrowedItems.length}`;
    }
    ;
}
Member.nextId = 1;
class LibraryItem {
    constructor(title, standardLoanPeriod) {
        this.id = LibraryItem.nextId++;
        this.title = title;
        this.isAvailable = true;
        this.standardLoanPeriod = standardLoanPeriod;
    }
    borrowItem(member) {
        if (this.isAvailable) {
            this.isAvailable = false;
            member.borrowedItems.push(this);
            return true;
        }
        return false;
    }
    returnItem(member) {
        const index = member.borrowedItems.indexOf(this);
        if (index !== -1) {
            this.isAvailable = true;
            member.borrowedItems.splice(index, 1);
            return true;
        }
        return false;
    }
    getLoanPeriod() {
        return this.standardLoanPeriod;
    }
}
LibraryItem.nextId = 1;
class Book extends LibraryItem {
    constructor(title, author, standardLoanPeriod, lateReturnFee) {
        super(title, standardLoanPeriod);
        this.author = author;
        this.standardLoanPeriod = standardLoanPeriod;
        this.lateReturnFee = lateReturnFee;
    }
}
class Magazine extends LibraryItem {
    constructor(title, issueNumber, standardLoanPeriod, lateReturnFee) {
        super(title, standardLoanPeriod);
        this.issueNumber = issueNumber;
        this.standardLoanPeriod = standardLoanPeriod;
        this.lateReturnFee = lateReturnFee;
    }
}
class Loan {
    constructor(member, name, item, dueDate) {
        this.loanId = Loan.nextId++;
        this.member = member;
        this.name = name;
        this.item = item;
        this.dueDate = dueDate;
        this.isReturned = false;
    }
    getDetails() {
        return `Loan ID: ${this.loanId}, Member: ${this.member.getDetails()}, Item: ${this.item.title}, Due Date: ${this.dueDate.toDateString()}, Returned: ${this.isReturned}`;
    }
}
Loan.nextId = 1;
class Library {
    constructor(loanId, member, item, dueDate) {
        this.loanId = loanId;
        this.member = member;
        this.item = item;
        this.dueDate = dueDate;
        this.isReturned = false;
    }
    getDetails() {
        return `Loan ID: ${this.loanId}, Member: ${this.member.getDetails()}, Item: ${this.item.title}, Due Date: ${this.dueDate.toDateString()}, Returned: ${this.isReturned}`;
    }
    static addItem(item) {
        Library.items.push(item);
    }
    static addMember(name, contact) {
        const newMember = new Member(name, contact);
        Library.members.push(newMember);
        return newMember;
    }
    static borrowItem(memberId, itemId) {
        const member = Library.members.find(m => m.memberId === memberId);
        const item = Library.items.find(i => i.id === itemId);
        if (member && item && item.isAvailable) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + item.getLoanPeriod());
            const loan = new Loan(member, member.name, item, dueDate);
            item.borrowItem(member);
            Library.loans.push(loan);
            return loan;
        }
        return null;
    }
    static returnItem(itemId) {
        const item = Library.items.find(i => i.id === itemId);
        const loan = Library.loans.find(l => l.item.id === itemId);
        if (item && loan) {
            item.returnItem(loan.member);
            loan.isReturned = true;
            return true;
        }
        return false;
    }
    static listBorrowedItemsByMember(memberId) {
        return Library.loans
            .filter(loan => loan.member.memberId === memberId && !loan.isReturned)
            .map(loan => loan.item);
    }
    static listAvailableItems() {
        return Library.items.filter(item => item.isAvailable);
    }
}
Library.nextId = 1;
Library.items = [];
Library.members = [];
Library.loans = [];
const printMenu = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    while (true) {
        const choiceInput = prompt(`
    -----MENU-----
    1. Thêm thành viên mới
    2. Thêm tài liệu mới 
    3. Mượn tài liệu
    4. Trả tài liệu
    5. Hiển thị danh sách tài liệu có sẵn
    6. Hiển thị danh sách tài liệu đang mượn của một thành viên
    7. Tính và hiển thị tổng phí phạt đã thu
    8. Thống kê số lượng từng loại tài liệu
    9. Cập nhật tiêu đề một tài liệu
    10. Tìm kiếm thành viên hoặc tài liệu theo ID
    11.Thoát chương trình
    Nhập lựa chọn của bạn:`);
        const choice = Number(choiceInput);
        if (isNaN(choice) || choice < 0) {
            alert('Vui lòng nhập số hợp lệ.');
            continue;
        }
        switch (choice) {
            case 1:
                const memberName = (_a = prompt('Nhập tên thành viên:')) !== null && _a !== void 0 ? _a : '';
                const memberContact = (_b = prompt('Nhập thông tin liên hệ của thành viên:')) !== null && _b !== void 0 ? _b : '';
                const newMember = Library.addMember(memberName, memberContact);
                alert('Thêm thành viên thành công.');
                break;
            case 2:
                const itemType = (_d = (_c = prompt('Nhập loại tài liệu (sách/tạp chí):')) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : '';
                const itemTitle = (_e = prompt('Nhập tiêu đề tài liệu:')) !== null && _e !== void 0 ? _e : '';
                let newItem = null;
                if (itemType === 'sách') {
                    const author = (_f = prompt('Nhập tên tác giả:')) !== null && _f !== void 0 ? _f : '';
                    const standardLoanPeriod = Number((_g = prompt('Nhập thời gian mượn chuẩn (ngày):')) !== null && _g !== void 0 ? _g : '14');
                    const lateReturnFee = Number((_h = prompt('Nhập phí trả muộn:')) !== null && _h !== void 0 ? _h : '5000');
                    newItem = new Book(itemTitle, author, standardLoanPeriod, lateReturnFee);
                }
                else if (itemType === 'tạp chí') {
                    const issueNumber = Number((_j = prompt('Nhập số phát hành:')) !== null && _j !== void 0 ? _j : '0');
                    const standardLoanPeriod = Number((_k = prompt('Nhập thời gian mượn chuẩn (ngày):')) !== null && _k !== void 0 ? _k : '14');
                    const lateReturnFee = Number((_l = prompt('Nhập phí trả muộn:')) !== null && _l !== void 0 ? _l : '5000');
                    newItem = new Magazine(itemTitle, issueNumber, standardLoanPeriod, lateReturnFee);
                }
                if (newItem) {
                    Library.addItem(newItem);
                    alert('Thêm tài liệu thành công.');
                }
                else {
                    alert('Thêm tài liệu thất bại.');
                }
                break;
            case 3:
                const borrowMemberId = Number((_m = prompt('Nhập ID thành viên:')) !== null && _m !== void 0 ? _m : '0');
                const itemId = Number((_o = prompt('Nhập ID tài liệu:')) !== null && _o !== void 0 ? _o : '0');
                const loan = Library.borrowItem(borrowMemberId, itemId);
                if (loan) {
                    alert('Mượn tài liệu thành công.');
                }
                else {
                    alert('Mượn tài liệu thất bại.');
                }
                break;
            case 4:
                const returnItemId = Number((_p = prompt('Nhập ID tài liệu cần trả:')) !== null && _p !== void 0 ? _p : '0');
                const isReturned = Library.returnItem(returnItemId);
                if (isReturned) {
                    alert('Trả tài liệu thành công.');
                }
                else {
                    alert('Trả tài liệu thất bại.');
                }
                break;
            case 5:
                const availableItems = Library.listAvailableItems();
                if (availableItems.length > 0) {
                    alert('Danh sách tài liệu có sẵn:\n' + availableItems.map(item => item.title).join('\n'));
                }
                else {
                    alert('Không có tài liệu nào có sẵn.');
                }
                break;
            case 6:
                const listMemberId = Number((_q = prompt('Nhập ID thành viên:')) !== null && _q !== void 0 ? _q : '0');
                const borrowedItems = Library.listBorrowedItemsByMember(listMemberId);
                if (borrowedItems.length > 0) {
                    alert('Danh sách tài liệu đang mượn của thành viên:\n' + borrowedItems.map(item => item.title).join('\n'));
                }
                else {
                    alert('Không có tài liệu nào đang mượn.');
                }
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            case 11:
                alert('Thoát chương trình');
                return;
            default:
                alert('Lựa chọn không hợp lệ.');
        }
    }
};
printMenu();
