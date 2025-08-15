class Member {
    static nextId: number = 1;
    memberId: number;
    name: string;
    contact: string;
    borrowedItems: LibraryItem[];
    constructor(name: string, contact: string) {
        this.memberId = Member.nextId++;
        this.name = name;
        this.contact = contact;
        this.borrowedItems = [];
    }
    getDetails(): string {
        return `ID: ${this.memberId}, Name: ${this.name}, Contact: ${this.contact}, Borrowed Items: ${this.borrowedItems.length}`;
        };
    }
   

abstract class LibraryItem {
  static nextId: number = 1;
  id: number;
  title: string;
  isAvailable: boolean;
  standardLoanPeriod: number;
  constructor(title: string, standardLoanPeriod: number) {
    this.id = LibraryItem.nextId++;
    this.title = title;
    this.isAvailable = true;
    this.standardLoanPeriod = standardLoanPeriod;
  }

  borrowItem(member: Member): boolean {
    if (this.isAvailable) {
      this.isAvailable = false;
      member.borrowedItems.push(this);
      return true;
    }
    return false;
  }

  returnItem(member: Member): boolean {
    const index = member.borrowedItems.indexOf(this);
    if (index !== -1) {
      this.isAvailable = true;
      member.borrowedItems.splice(index, 1);
      return true;
    }
    return false;
  }

  getLoanPeriod(): number {
    return this.standardLoanPeriod;
  }
}


class Book extends LibraryItem {
    author: string;
    standardLoanPeriod: number;
    lateReturnFee: number;
    constructor(title: string, author: string, standardLoanPeriod: number, lateReturnFee: number) {
        super(title, standardLoanPeriod);
        this.author = author;
        this.standardLoanPeriod = standardLoanPeriod;
        this.lateReturnFee = lateReturnFee;
    }
}

class Magazine extends LibraryItem {
    issueNumber: number;
    standardLoanPeriod: number;
    lateReturnFee: number;
    constructor(title: string, issueNumber: number, standardLoanPeriod: number, lateReturnFee: number) {
        super(title, standardLoanPeriod);
        this.issueNumber = issueNumber;
        this.standardLoanPeriod = standardLoanPeriod;
        this.lateReturnFee = lateReturnFee;
    }
}

class Loan {
  static nextId: number = 1;
  loanId: number;
  member: Member;
  name: string;
  item: LibraryItem;
  dueDate: Date;
  isReturned: boolean;
  constructor(member: Member, name: string, item: LibraryItem, dueDate: Date) {
    this.loanId = Loan.nextId++;
    this.member = member;
    this.name = name;
    this.item = item;
    this.dueDate = dueDate;
    this.isReturned = false;
  }
  getDetails(): string {
    return `Loan ID: ${this.loanId}, Member: ${this.member.getDetails()}, Item: ${this.item.title}, Due Date: ${this.dueDate.toDateString()}, Returned: ${this.isReturned}`;
  }
}

class Library {
    static nextId: number = 1;
    static items: LibraryItem[] = [];
    static members: Member[] = [];
    static loans: Loan[] = [];
    loanId: number;
    member: Member;
    item: LibraryItem;
    dueDate: Date;
    isReturned: boolean;
    constructor(loanId: number, member: Member, item: LibraryItem, dueDate: Date) {
        this.loanId = loanId;
        this.member = member;
        this.item = item;
        this.dueDate = dueDate;
        this.isReturned = false;
    }
    getDetails(): string {
        return `Loan ID: ${this.loanId}, Member: ${this.member.getDetails()}, Item: ${this.item.title}, Due Date: ${this.dueDate.toDateString()}, Returned: ${this.isReturned}`;
    }
    static addItem(item: LibraryItem): void {
        Library.items.push(item);
    }
    
    static addMember(name: string, contact: string): Member {
        const newMember = new Member(name, contact);
        Library.members.push(newMember);
        return newMember;
    }

    static borrowItem(memberId: number, itemId: number): Loan | null {
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
    static returnItem(itemId: number): boolean {
        const item = Library.items.find(i => i.id === itemId);
        const loan = Library.loans.find(l => l.item.id === itemId);
        if (item && loan) {
            item.returnItem(loan.member);
            loan.isReturned = true;
            return true;
        }
        return false;
    }
    static listBorrowedItemsByMember(memberId: number): LibraryItem[] {
        return Library.loans
            .filter(loan => loan.member.memberId === memberId && !loan.isReturned)
            .map(loan => loan.item);
    }
    static listAvailableItems(): LibraryItem[] {
        return Library.items.filter(item => item.isAvailable);
    }
}

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
    11.Thoát chương trình
    Nhập lựa chọn của bạn:`)

    const choice = Number(choiceInput);
    if (isNaN(choice) || choice < 0) {
        alert('Vui lòng nhập số hợp lệ.');
        continue;
    }
    switch (choice) {
        case 1:
            const memberName = prompt('Nhập tên thành viên:') ?? '';
            const memberContact = prompt('Nhập thông tin liên hệ của thành viên:') ?? '';
            const newMember = Library.addMember(memberName, memberContact);
            alert('Thêm thành viên thành công.');
            break;
        case 2:
            const itemType = prompt('Nhập loại tài liệu (sách/tạp chí):')?.toLowerCase() ?? '';
            const itemTitle = prompt('Nhập tiêu đề tài liệu:') ?? '';
            let newItem: LibraryItem | null = null;
            if (itemType === 'sách') {
                const author = prompt('Nhập tên tác giả:') ?? '';
                const standardLoanPeriod = Number(prompt('Nhập thời gian mượn chuẩn (ngày):') ?? '14');
                const lateReturnFee = Number(prompt('Nhập phí trả muộn:') ?? '5000');
                newItem = new Book(itemTitle, author, standardLoanPeriod, lateReturnFee);
            } else if (itemType === 'tạp chí') {
                const issueNumber = Number(prompt('Nhập số phát hành:') ?? '0');
                const standardLoanPeriod = Number(prompt('Nhập thời gian mượn chuẩn (ngày):') ?? '14');
                const lateReturnFee = Number(prompt('Nhập phí trả muộn:') ?? '5000');
                newItem = new Magazine(itemTitle, issueNumber, standardLoanPeriod, lateReturnFee);
            }
            if (newItem) {
                Library.addItem(newItem);
                alert('Thêm tài liệu thành công.');
            } else {
                alert('Thêm tài liệu thất bại.');
            }
            break;
        case 3:
            const borrowMemberId = Number(prompt('Nhập ID thành viên:') ?? '0');
            const itemId = Number(prompt('Nhập ID tài liệu:') ?? '0');
            const loan = Library.borrowItem(borrowMemberId, itemId);
            if (loan) {
                alert('Mượn tài liệu thành công.');
            } else {
                alert('Mượn tài liệu thất bại.');
            }
            break;
        case 4:
            const returnItemId = Number(prompt('Nhập ID tài liệu cần trả:') ?? '0');
            const isReturned = Library.returnItem(returnItemId);
            if (isReturned) {
                alert('Trả tài liệu thành công.');
            } else {
                alert('Trả tài liệu thất bại.');
            }
            break;
        case 5:
            const availableItems = Library.listAvailableItems();
            if (availableItems.length > 0) {
                alert('Danh sách tài liệu có sẵn:\n' + availableItems.map(item => item.title).join('\n'));
            } else {
                alert('Không có tài liệu nào có sẵn.');
            }
            break;
        case 6:
            const listMemberId = Number(prompt('Nhập ID thành viên:') ?? '0');
            const borrowedItems = Library.listBorrowedItemsByMember(listMemberId);
            if (borrowedItems.length > 0) {
                alert('Danh sách tài liệu đang mượn của thành viên:\n' + borrowedItems.map(item => item.title).join('\n'));
            } else {
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
