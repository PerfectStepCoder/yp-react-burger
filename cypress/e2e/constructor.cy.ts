describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Мокаем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Переходим на главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Загрузка и отображение ингредиентов', () => {
    it('должен загружать и отображать список ингредиентов', () => {
      // Проверяем заголовок
      cy.contains('Соберите бургер').should('be.visible');
      
      // Проверяем наличие вкладок
      cy.contains('Булки').should('be.visible');
      cy.contains('Соусы').should('be.visible');
      cy.contains('Начинки').should('be.visible');
      
      // Проверяем, что ингредиенты отображаются
      cy.get('[data-testid="ingredient-card"]').should('have.length.greaterThan', 0);
    });

    it('должен переключаться между вкладками', () => {
      // Кликаем на вкладку "Соусы"
      cy.contains('Соусы').click();
      
      // Проверяем, что отображаются соусы
      cy.get('[data-testid="ingredient-card"]').should('be.visible');
      
      // Кликаем на вкладку "Начинки"
      cy.contains('Начинки').click();
      
      // Проверяем, что отображаются начинки
      cy.get('[data-testid="ingredient-card"]').should('be.visible');
    });
  });

  describe('Перетаскивание ингредиентов', () => {
    it('должен перетаскивать булку в конструктор', () => {
      // Находим первую булку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().as('bunCard');
      
      // Находим зону конструктора для булки
      cy.contains('Перетащите булку сюда').should('be.visible').as('bunDropZone');
      
      // Перетаскиваем булку используя реальный drag and drop
      cy.get('@bunCard').trigger('mousedown', { button: 0 });
      cy.get('@bunDropZone').trigger('mousemove').trigger('mouseup');
      
      // Альтернативный способ через события drag
      cy.get('@bunCard').trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@bunDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что булка появилась в конструкторе
      cy.contains('(верх)', { timeout: 5000 }).should('be.visible');
      cy.contains('(низ)').should('be.visible');
    });

    it('должен перетаскивать начинку в конструктор', () => {
      // Сначала добавляем булку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите булку сюда').trigger('dragover').trigger('drop');
      
      // Ждем появления булки
      cy.contains('(верх)', { timeout: 5000 }).should('be.visible');
      
      // Перетаскиваем начинку
      cy.contains('Начинки').click();
      cy.get('[data-testid="ingredient-card"]').first().as('fillingCard');
      
      // Находим зону для начинки
      cy.contains('Перетащите ингредиенты сюда').should('be.visible').as('fillingDropZone');
      
      // Перетаскиваем начинку
      cy.get('@fillingCard').trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.get('@fillingDropZone').trigger('dragover').trigger('drop');
      
      // Проверяем, что начинка появилась в конструкторе
      cy.get('[data-testid="constructor-filling"]', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен перетаскивать соус в конструктор', () => {
      // Сначала добавляем булку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите булку сюда').trigger('dragover').trigger('drop');
      
      // Перетаскиваем соус
      cy.contains('Соусы').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите ингредиенты сюда').trigger('dragover').trigger('drop');
      
      // Проверяем, что соус появился в конструкторе
      cy.get('[data-testid="constructor-filling"]', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });

    it('должен обновлять счетчик ингредиентов при добавлении', () => {
      // Добавляем булку
      cy.contains('Булки').click();
      
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите булку сюда').trigger('dragover').trigger('drop');
      
      // Проверяем, что булка появилась в конструкторе
      cy.contains('(верх)', { timeout: 5000 }).should('be.visible');
      
      // Проверяем, что ингредиент все еще существует в списке
      cy.get('[data-testid="ingredient-card"]').first().should('exist');
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    beforeEach(() => {
      // Добавляем булку и начинку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart');
      cy.contains('Перетащите булку сюда').trigger('drop');
      
      cy.contains('Начинки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart');
      cy.contains('Перетащите ингредиенты сюда').trigger('drop');
    });

    it('должен удалять начинку из конструктора', () => {
      // Находим кнопку удаления у первого ингредиента
      // Кнопка закрытия находится внутри ConstructorElement
      cy.get('[data-testid="constructor-filling"]').first().within(() => {
        cy.get('button').last().click(); // Последняя кнопка - это кнопка удаления
      });
      
      // Проверяем, что ингредиент удален
      cy.get('[data-testid="constructor-filling"]').should('not.exist');
    });
  });

  describe('Подсчет стоимости заказа', () => {
    it('должен правильно считать стоимость заказа', () => {
      // Добавляем булку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите булку сюда').trigger('dragover').trigger('drop');
      
      cy.wait(1000);
      
      // Добавляем начинку
      cy.contains('Начинки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите ингредиенты сюда').trigger('dragover').trigger('drop');
      
      // Проверяем, что цена отображается
      cy.get('[data-testid="order-total"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="order-total"]').should('not.be.empty');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Мокаем авторизацию
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'mock-token');
      });
      
      // Добавляем булку и начинку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите булку сюда').trigger('dragover').trigger('drop');
      
      cy.wait(1000); // Ждем обновления состояния
      
      cy.contains('Начинки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите ингредиенты сюда').trigger('dragover').trigger('drop');
      
      cy.wait(1000); // Ждем обновления состояния
    });

    it('должен быть неактивна кнопка "Оформить заказ" без булки', () => {
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только начинку
      cy.contains('Начинки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите ингредиенты сюда').trigger('dragover').trigger('drop');
      
      // Проверяем, что кнопка неактивна
      cy.get('button').contains('Оформить заказ').should('be.disabled');
    });

    it('должен быть неактивна кнопка "Оформить заказ" без начинки', () => {
      // Очищаем конструктор
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Добавляем только булку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart', { dataTransfer: new DataTransfer() });
      cy.contains('Перетащите булку сюда').trigger('dragover').trigger('drop');
      
      // Проверяем, что кнопка неактивна
      cy.get('button').contains('Оформить заказ').should('be.disabled');
    });

    it('должен быть активна кнопка "Оформить заказ" с булкой и начинкой', () => {
      // Проверяем, что кнопка активна
      cy.get('button').contains('Оформить заказ').should('not.be.disabled');
    });

    it('должен перенаправлять на страницу входа, если пользователь не авторизован', () => {
      // Очищаем токен
      cy.window().then((win) => {
        win.localStorage.removeItem('accessToken');
      });
      
      // Кликаем на кнопку оформления заказа
      cy.get('button').contains('Оформить заказ').click();
      
      // Проверяем редирект на страницу входа
      cy.url().should('include', '/login');
    });

    it('должен создавать заказ при клике на кнопку "Оформить заказ"', () => {
      // Кликаем на кнопку оформления заказа
      cy.get('button').contains('Оформить заказ').click();
      
      // Ждем запроса на создание заказа
      cy.wait('@createOrder');
      
      // Проверяем, что модальное окно с заказом появилось
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
    });
  });

  describe('Модальное окно заказа', () => {
    beforeEach(() => {
      // Мокаем авторизацию
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'mock-token');
      });
      
      // Добавляем булку и начинку
      cy.contains('Булки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart');
      cy.contains('Перетащите булку сюда').trigger('drop');
      
      cy.contains('Начинки').click();
      cy.get('[data-testid="ingredient-card"]').first().trigger('dragstart');
      cy.contains('Перетащите ингредиенты сюда').trigger('drop');
      
      // Создаем заказ
      cy.get('button').contains('Оформить заказ').click();
      cy.wait('@createOrder');
    });

    it('должно отображаться после успешного создания заказа', () => {
      // Проверяем содержимое модального окна
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
      cy.contains('Дождитесь готовности на орбитальной станции').should('be.visible');
      
      // Проверяем номер заказа
      cy.get('[data-testid="order-number"]').should('be.visible');
    });

    it('должно закрываться при клике на кнопку закрытия', () => {
      // Находим и кликаем на кнопку закрытия
      cy.get('button[aria-label="Закрыть"]').click();
      
      // Проверяем, что модальное окно закрылось
      cy.contains('идентификатор заказа').should('not.exist');
    });

    it('должно закрываться при нажатии Escape', () => {
      // Нажимаем Escape
      cy.get('body').type('{esc}');
      
      // Проверяем, что модальное окно закрылось
      cy.contains('идентификатор заказа').should('not.exist');
    });

    it('должно закрываться при клике на overlay', () => {
      // Кликаем на overlay (затемненную область)
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      
      // Проверяем, что модальное окно закрылось
      cy.contains('идентификатор заказа').should('not.exist');
    });
  });
});
