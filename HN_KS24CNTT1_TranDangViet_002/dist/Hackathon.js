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
}
Member.nextId = 1;
class LibraryItem {
    constructor(title) {
        this.id = LibraryItem.nextId++;
        this.title = title;
        this.isAvailable = true;
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
}
LibraryItem.nextId = 1;
class Book extends LibraryItem {
    constructor(title, author) {
        super(title);
        this.author = author;
    }
    calculateLateFee(daysOverdue) {
        return daysOverdue * 10000;
    }
    getLoanPeriod() {
        return 30;
    }
    getItemType() {
        return "Sách";
    }
}
class Magazine extends LibraryItem {
    constructor(title, issueNumber) {
        super(title);
        this.issueNumber = issueNumber;
    }
    calculateLateFee(daysOverdue) {
        return daysOverdue * 5000;
    }
    getLoanPeriod() {
        return 7;
    }
    getItemType() {
        return "Tạp chí";
    }
}
class Loan {
    constructor(member, item, dueDate) {
        this.loanId = Loan.nextId++;
        this.member = member;
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
    static addItem(item) {
        this.items.push(item);
    }
    static addMember(name, contact) {
        const member = new Member(name, contact);
        this.members.push(member);
        return member;
    }
    static borrowItem(memberId, itemId) {
        const member = this.members.find(m => m.memberId === memberId);
        const item = this.items.find(i => i.id === itemId);
        if (member && item && item.isAvailable) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + item.getLoanPeriod());
            const loan = new Loan(member, item, dueDate);
            item.borrowItem(member);
            this.loans.push(loan);
            return loan;
        }
        return null;
    }
    static returnItem(itemId) {
        const loan = this.loans.find(l => l.item.id === itemId && !l.isReturned);
        if (loan) {
            loan.item.returnItem(loan.member);
            loan.isReturned = true;
            return true;
        }
        return false;
    }
    static listAvailableItems() {
        return this.items.filter(item => item.isAvailable);
    }
    static listMemberLoans(memberId) {
        return this.loans
            .filter(loan => loan.member.memberId === memberId && !loan.isReturned)
            .map(loan => loan.item);
    }
}
Library.items = [];
Library.members = [];
Library.loans = [];
const printMenu = () => {
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
11. Thoát chương trình
Nhập lựa chọn của bạn:`);
        const choice = Number(choiceInput);
        if (isNaN(choice) || choice < 1 || choice > 11) {
            alert(`Nhập số không hợp lệ`);
            continue;
        }
        switch (choice) {
            case 1: {
                const memberName = prompt(`Nhập tên thành viên:`);
                const memberContact = prompt(`Nhập thông tin liên hệ của thành viên:`);
                if (!memberName || !memberContact) {
                    alert(`Thông tin không hợp lệ.`);
                    break;
                }
                const newMember = Library.addMember(memberName, memberContact);
                alert(`Thêm thành viên thành công. Mã thành viên: ${newMember.memberId}`);
                break;
            }
            case 2: {
                const itemType = prompt(`Nhập loại tài liệu (sách/tạp chí):`);
                const itemTitle = prompt(`Nhập tiêu đề tài liệu:`);
                if (!itemType || !itemTitle) {
                    alert(`Thông tin không hợp lệ.`);
                    break;
                }
                let newItem = null;
                if (itemType.toLowerCase() === 'sách') {
                    const author = prompt(`Nhập tên tác giả:`);
                    if (!author) {
                        alert(`Tên tác giả không hợp lệ.`);
                        break;
                    }
                    newItem = new Book(itemTitle, author);
                }
                else if (itemType.toLowerCase() === 'tạp chí') {
                    const issueInput = prompt(`Nhập số phát hành:`);
                    const issueNumber = Number(issueInput);
                    if (isNaN(issueNumber)) {
                        alert(`Số phát hành không hợp lệ.`);
                        break;
                    }
                    newItem = new Magazine(itemTitle, issueNumber);
                }
                else {
                    alert(`Loại tài liệu không hợp lệ.`);
                    break;
                }
                Library.addItem(newItem);
                alert(`Thêm tài liệu thành công. Mã tài liệu: ${newItem.id}`);
                break;
            }
            case 3: {
                const memberIdInput = prompt(`Nhập ID thành viên:`);
                const itemIdInput = prompt(`Nhập ID tài liệu:`);
                const memberId = Number(memberIdInput);
                const itemId = Number(itemIdInput);
                if (isNaN(memberId) || isNaN(itemId)) {
                    alert(`ID không hợp lệ.`);
                    break;
                }
                const loan = Library.borrowItem(memberId, itemId);
                if (loan) {
                    alert(`Mượn tài liệu thành công. Ngày hết hạn: ${loan.dueDate.toDateString()}`);
                }
                else {
                    alert(`Mượn tài liệu thất bại.`);
                }
                break;
            }
            case 4: {
                const itemIdInput = prompt(`Nhập ID tài liệu cần trả:`);
                const itemId = Number(itemIdInput);
                if (isNaN(itemId)) {
                    alert(`ID không hợp lệ.`);
                    break;
                }
                const success = Library.returnItem(itemId);
                if (success) {
                    alert(`Trả tài liệu thành công.`);
                }
                else {
                    alert(`Trả tài liệu thất bại.`);
                }
                break;
            }
            case 5: {
                const availableItems = Library.listAvailableItems();
                if (availableItems.length > 0) {
                    let list = '';
                    for (const item of availableItems) {
                        list += `ID: ${item.id} - ${item.title} (${item.getItemType()})\n`;
                    }
                    alert(`Danh sách tài liệu có sẵn:\n${list}`);
                }
                else {
                    alert(`Không có tài liệu nào có sẵn.`);
                }
                break;
            }
            case 6: {
                const memberIdInput = prompt(`Nhập ID thành viên:`);
                const memberId = Number(memberIdInput);
                if (isNaN(memberId)) {
                    alert(`ID không hợp lệ.`);
                    break;
                }
                const borrowedItems = Library.listMemberLoans(memberId);
                if (borrowedItems.length > 0) {
                    let list = '';
                    for (const item of borrowedItems) {
                        list += `ID: ${item.id} - ${item.title} (${item.getItemType()})\n`;
                    }
                    alert(`Danh sách tài liệu đang mượn:\n${list}`);
                }
                else {
                    alert(`Thành viên không mượn tài liệu nào.`);
                }
                break;
            }
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            case 11:
                alert(`Thoát chương trình.`);
                return;
            default:
                alert(`Lựa chọn không hợp lệ.`);
        }
    }
};
printMenu();
