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
  }
}

abstract class LibraryItem {
  static nextId: number = 1;
  id: number;
  title: string;
  isAvailable: boolean;
  constructor(title: string) {
    this.id = LibraryItem.nextId++;
    this.title = title;
    this.isAvailable = true;
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
  abstract calculateLateFee(daysOverdue: number): number;
  abstract getLoanPeriod(): number;
  abstract getItemType(): string;
}


class Book extends LibraryItem {
  author: string;
  constructor(title: string, author: string) {
    super(title);
    this.author = author;
  }
  calculateLateFee(daysOverdue: number): number {
    return daysOverdue * 10000;
  }
  getLoanPeriod(): number {
    return 30;
  }
  getItemType(): string {
    return "Sách";
  }
}

class Magazine extends LibraryItem {
  issueNumber: number;
  constructor(title: string, issueNumber: number) {
    super(title);
    this.issueNumber = issueNumber;
  }
  calculateLateFee(daysOverdue: number): number {
    return daysOverdue * 5000;
  }
  getLoanPeriod(): number {
    return 7;
  }
  getItemType(): string {
    return "Tạp chí";
  }
}


class Loan {
  static nextId: number = 1;
  loanId: number;
  member: Member;
  item: LibraryItem;
  dueDate: Date;
  isReturned: boolean;
  constructor(member: Member, item: LibraryItem, dueDate: Date) {
    this.loanId = Loan.nextId++;
    this.member = member;
    this.item = item;
    this.dueDate = dueDate;
    this.isReturned = false;
  }

  getDetails(): string {
    return `Loan ID: ${this.loanId}, Member: ${this.member.getDetails()}, Item: ${this.item.title}, Due Date: ${this.dueDate.toDateString()}, Returned: ${this.isReturned}`;
  }
}

class Library {
  static items: LibraryItem[] = [];
  static members: Member[] = [];
  static loans: Loan[] = [];
  static addItem(item: LibraryItem): void {
    this.items.push(item);
  }
  static addMember(name: string, contact: string): Member {
    const member = new Member(name, contact);
    this.members.push(member);
    return member;
  }
  static borrowItem(memberId: number, itemId: number): Loan | null {
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

  static returnItem(itemId: number): boolean {
  const loan = this.loans.find(l => l.item.id === itemId && !l.isReturned);
  if (loan) {
    loan.item.returnItem(loan.member);
    loan.isReturned = true;
    return true;
  }
  return false;
}

  static listAvailableItems(): LibraryItem[] {
    return this.items.filter(item => item.isAvailable);
  }
  static listMemberLoans(memberId: number): LibraryItem[] {
    return this.loans
      .filter(loan => loan.member.memberId === memberId && !loan.isReturned)
      .map(loan => loan.item);
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
        let newItem: LibraryItem | null = null;
        if (itemType.toLowerCase() === 'sách') {
          const author = prompt(`Nhập tên tác giả:`);
          if (!author) {
            alert(`Tên tác giả không hợp lệ.`);
            break;
          }
          newItem = new Book(itemTitle, author);
        } else if (itemType.toLowerCase() === 'tạp chí') {
          const issueInput = prompt(`Nhập số phát hành:`);
          const issueNumber = Number(issueInput);
          if (isNaN(issueNumber)) {
            alert(`Số phát hành không hợp lệ.`);
            break;
          }
          newItem = new Magazine(itemTitle, issueNumber);
        } else {
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
        } else {
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
        } else {
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
        } else {
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
        } else {
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
